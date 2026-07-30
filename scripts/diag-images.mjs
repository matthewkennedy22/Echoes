import { writeFileSync } from "fs";

const UA =
  "ECHOES/0.1 (local history education; matthewkennedy22@gmail.com)";

const portraits = [
  ["bancroft", "Hubert_Howe_Bancroft.jpg"],
  ["horton", "Alonzo_Horton.jpg"],
  ["horton2", "HORTON,_Alonzo_Erastus_(1813-1909).jpg"],
  ["mason", "Mission_Santa_Barbara_by_Carleton_Watkins,_1876.jpg"],
  ["muir", "John_Muir_1912.jpg"],
  ["hemme", "Danville_Southern_Pacific_Railroad_Depot_(Danville,_CA).JPG"],
  ["myron-local", null],
];

const extras = [
  "Mission_of_Los_Dolores._1856.jpg",
  "San_Francisco_Mission_Dolores.jpg",
  "San_Francisco_1890.jpg",
  "Entrance_to_Golden_Gate_and_Angel_Island_(before_the_bridge),_San_Francisco,_ca.1900_(CHS-3943).jpg",
  "The_Golden_Gate_and_Mount_Tamalpais_from_Telegraph_Hill,_San_Francisco_Bay_Area,_California,_1900.jpg",
  "Bancroft_House,_9050_Memory_Lane,_Spring_Valley_(San_Diego_County,_California).jpg",
  "View_of_Horton_House,_by_Parker_&_Parker.jpg",
  "HortonPlaza&BroadwayFountain1915.jpg",
  "I.J._Wilde_Electric_Fountain_in_Plaza_Park,_U.S._Grant_Hotel_in_Background,_San_Diego,_Cal.jpg",
  "San_Diego_County_Court_House,_circa_1885.jpg",
  "Gaslamp_Museum.jpg",
];

async function checkFile(file) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(file)}&prop=imageinfo&iiprop=url|mime|size&format=json`;
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  const missing = page?.missing != null || String(page?.pageid) === "-1";
  const info = page?.imageinfo?.[0];
  return {
    file,
    exists: !missing && !!info?.url,
    url: info?.url || null,
    mime: info?.mime || null,
    size: info?.size || null,
  };
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(20000),
    });
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get("content-type") || "";
    return {
      status: res.status,
      ok: res.ok && (/^image\//i.test(ct) || buf[0] === 0xff || buf[0] === 0x89),
      ct,
      bytes: buf.length,
    };
  } catch (e) {
    return { ok: false, err: String(e.message || e) };
  }
}

async function main() {
  const results = [];
  for (const [label, file] of portraits) {
    if (!file) {
      const local = await checkUrl("http://localhost:3000/myron-angel.jpg");
      results.push({ label, file: "/myron-angel.jpg", ...local });
      continue;
    }
    await new Promise((r) => setTimeout(r, 300));
    const meta = await checkFile(file);
    let fetchRes = null;
    if (meta.exists && meta.url) {
      await new Promise((r) => setTimeout(r, 300));
      fetchRes = await checkUrl(meta.url);
    }
    const special = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;
    await new Promise((r) => setTimeout(r, 300));
    const specialRes = await checkUrl(special);
    results.push({
      label,
      file,
      commonsExists: meta.exists,
      directUrl: meta.url,
      directFetch: fetchRes,
      specialFetch: specialRes,
    });
  }

  console.log("=== PORTRAITS ===");
  console.log(JSON.stringify(results, null, 2));

  const extraResults = [];
  for (const file of extras) {
    await new Promise((r) => setTimeout(r, 350));
    const meta = await checkFile(file);
    extraResults.push({ file, exists: meta.exists, url: meta.url });
  }
  console.log("\n=== EXTRA FILES (existence) ===");
  console.log(JSON.stringify(extraResults.filter((x) => !x.exists), null, 2));
  console.log(
    `extras ok: ${extraResults.filter((x) => x.exists).length}/${extraResults.length}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
