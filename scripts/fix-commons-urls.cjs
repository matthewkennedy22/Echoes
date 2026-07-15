const fs = require("fs");

function rewriteImages(file) {
  let text = fs.readFileSync(file, "utf8");
  if (!text.includes('from "@/lib/commonsUrl"')) {
    text = text.replace(
      'import type { ImageAsset } from "@/lib/types";\n',
      'import type { ImageAsset } from "@/lib/types";\nimport { commonsFileUrl } from "@/lib/commonsUrl";\n'
    );
  }
  text = text.replace(
    /\nconst FP = "https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath";\n/g,
    "\n"
  );
  text = text.replace(
    /const FP = \(file: string\) =>\n  `https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/\$\{encodeURIComponent\(file\)\}`;\n/g,
    ""
  );
  text = text.replace(/src: `\$\{FP\}\/([^`]+)`/g, (_m, fileName) => {
    return `src: commonsFileUrl(${JSON.stringify(fileName)})`;
  });
  text = text.replace(/src: FP\((["'`])([\s\S]*?)\1\)/g, (_m, _q, fileName) => {
    const cleaned = fileName.replace(/\s+/g, " ").trim();
    // handle multiline string content
    const single = cleaned.replace(/\n\s*/g, "");
    return `src: commonsFileUrl(${JSON.stringify(single)})`;
  });
  fs.writeFileSync(file, text);
  console.log("updated", file);
}

for (const file of [
  "personas/jesse-d-mason/images.ts",
  "personas/mark-twain/images.ts",
  "personas/august-hemme/images.ts",
  "personas/alonzo-horton/images.ts",
  "personas/hubert-howe-bancroft/images.ts",
  "personas/anita-loos/images.ts",
]) {
  rewriteImages(file);
}

function encodePublicPortrait(file, commonsFile) {
  let text = fs.readFileSync(file, "utf8");
  const encoded = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(commonsFile)}`;
  text = text.replace(
    /portraitImage:\s*\n?\s*"https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/[^"]+"/,
    `portraitImage:\n    "${encoded}"`
  );
  fs.writeFileSync(file, text);
  console.log("portrait", file);
}

encodePublicPortrait(
  "personas/jesse-d-mason/public.ts",
  "Mission_Santa_Barbara_by_Carleton_Watkins,_1876.jpg"
);
encodePublicPortrait(
  "personas/august-hemme/public.ts",
  "Danville_Southern_Pacific_Railroad_Depot_(Danville,_CA).JPG"
);
encodePublicPortrait("personas/mark-twain/public.ts", "Mark_Twain_1907.jpg");
encodePublicPortrait("personas/alonzo-horton/public.ts", "Alonzo_Horton.jpg");
encodePublicPortrait(
  "personas/hubert-howe-bancroft/public.ts",
  "Hubert_Howe_Bancroft.jpg"
);
