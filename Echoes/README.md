# ECHOES

**Local history, made conversational.**

ECHOES is a source-grounded AI experience that lets users have a conversation with historical figures from San Luis Obispo history. The first figure is **Myron Angel**, a pioneer journalist, county historian, and early advocate for what became Cal Poly.

The project is currently built as a live beta experience for local history partners, museums, libraries, and educators to test how conversational AI can make historical learning more interactive, accurate, and engaging.

## Try the live demo

**Live website:** https://echoes-inky-zeta.vercel.app/

No app or account is required. Open the link on any phone or computer and ask Myron a question.

Suggested questions:
- Who were you?
- Tell me about the San Luis Obispo Mission.
- What did San Luis Obispo look like in your time?
- How did you help found the Polytechnic?

Note: The first question may take 30 to 60 seconds while the source library loads. After that, responses are much faster.

## What ECHOES does

ECHOES lets visitors ask questions in plain language and receive answers written in the voice of a historical figure. Unlike a general chatbot, the system is designed to answer only from a curated source library rather than the open internet.

Each response is grounded in historical material and labeled by evidence level:

- **Documented:** directly supported by the source material
- **Reasonable inference:** supported by context, but not directly stated
- **Contested:** the sources contain disagreement or uncertainty
- **Not in the sources:** the system does not have enough evidence to answer

Users can also open the evidence behind an answer to see where the response came from.

## Why I built it

I built ECHOES to explore a simple question:

**Can AI make local history more accessible without sacrificing accuracy?**

Most AI tools are impressive, but they can also hallucinate or blur the line between fact and invention. ECHOES is my attempt to build a more responsible version for education: one that shows its sources, labels uncertainty, and admits when the evidence is not there.

The project is also designed for real-world beta testing with the **History Center of San Luis Obispo County** and other local history partners. The goal is to learn whether this type of experience could be useful in museums, libraries, classrooms, walking tours, and public exhibits.

## Key features

- Conversational interface for asking historical questions
- Retrieval-augmented generation over a curated historical source library
- Evidence-labeled responses to reduce hallucinations
- Visible citations through a "Show evidence" interaction
- Historical image support for relevant topics
- Voice playback so users can hear responses aloud
- QR-code access for museum exhibits, visitor desks, or printed materials
- Mobile-responsive design for public use

## Technical overview

ECHOES combines a modern web application with a retrieval-augmented generation pipeline.

**Frontend**
- Next.js
- TypeScript
- React
- Custom responsive CSS
- Mobile-first chat interface

**AI and retrieval**
- Retrieval-augmented generation
- Embedding-based source search
- Curated historical source library
- Cached indexing for faster retrieval
- Evidence classification for response transparency

**Product and deployment**
- Live beta deployed on Vercel
- QR-code based public access
- Designed for museum and education use cases
- Partner outreach materials created for beta testing

## What makes it different

ECHOES is not meant to be a general-purpose chatbot. It is designed around three principles:

1. **Ground answers in real sources**  
   The system answers from a curated historical library, not from broad web knowledge.

2. **Show uncertainty clearly**  
   Responses are labeled by evidence strength so users can tell the difference between documented facts, reasonable interpretation, and missing evidence.

3. **Make history feel alive**  
   The experience is built to feel like a conversation, helping visitors engage with local history in a more natural and memorable way.

## Current status

ECHOES is in beta. The first version focuses on Myron Angel and San Luis Obispo history. The next step is to gather feedback from local history experts, museums, and educators to improve source coverage, accuracy, user experience, and public value.

Future directions include:
- Additional San Luis Obispo historical figures
- Expanded source collections
- Richer voice interaction
- More historical photographs and exhibits
- A future "living portrait" experience for museum installations

## About me

Built by **Matthew Kennedy**, a Cal Poly M.S. Business Analytics graduate and longtime San Luis Obispo resident.

I built ECHOES to combine my interests in data, AI, product development, and local history, with a focus on building AI systems that are useful, transparent, and grounded in evidence.

**LinkedIn:** https://www.linkedin.com/in/mkennedy2001/  
**Portfolio:** https://github.com/matthewkennedy22/Project-Portfolio  
**Email:** matthewkennedy22@gmail.com
