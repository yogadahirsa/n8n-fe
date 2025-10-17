const fs = require('fs');

function cleanText(text) {
    const lines = text.split('\n');
    return lines.filter(line => line.trim()).map(line => line.trim()).join('\n');
}

function getSectionType(domain, aspek, indikator) {
    if (indikator) return 'indikator';
    if (aspek) return 'aspek';
    if (domain) return 'domain';
    return 'general';
}

function parseDomain(text) {
    const match = text.match(/Domain (\d+)\s*\n?\s*:\s*(.+?)(?=\n(Aspek)|$)/s);
    if (match) {
        const name = match[2].replace(/\n/g, ' ').trim();
        return {
            number: parseInt(match[1]),
            name: name,
            label: `Domain ${match[1]}: ${name}`
        };
    }
    return null;
}

function parseAspek(text) {
    const match = text.match(/Aspek (\d+)\s*\n?\s*:\s*(.+?)(?=\n(Indikator)|$)/s);
    if (match) {
        const name = match[2].replace(/\n/g, ' ').trim();
        return {
            number: parseInt(match[1]),
            name: name,
            label: `Aspek ${match[1]}: ${name}`
        };
    }
    return null;
}

function parseIndikator(text) {
    const match = text.match(/Indikator (\d+)\s*\n?\s*:\s*(.+?)(?=Pertanyaan|$)/s);
    if (match) {
        const name = match[2].replace(/\n/g, ' ').trim();
        return {
            number: parseInt(match[1]),
            name: name,
            label: `Indikator ${match[1]}: ${name}`
        };
    }
    return null;
}

function extractSections(text) {
    const domainPattern = /(?=Domain \d+\s*:)/g;
    const sections = text.split(domainPattern).filter(s => s.trim());

    const data = [];
    let currentDomain = null;
    let currentAspek = null;

    for (const section of sections) {
        const domain = parseDomain(section);
        if (domain) {
            currentDomain = domain;
            const aspekMatch = section.match(/Aspek \d+\s*\n?\s*:\s*.+?(?=Indikator \d+\s*\n?\s*:|$)/s);
            if (aspekMatch) {
                currentAspek = parseAspek(aspekMatch[0]);
            } else {
                currentAspek = null;
            }
        } else {
            continue;
        }

        const indikatorPattern = /Indikator \d+\s*\n?\s*:\s*.+?(?=Pertanyaan \d+\s*\n?\s*:|$)/s;
        const indikators = section.match(indikatorPattern) || [];

        for (const indText of indikators) {
            const indikator = parseIndikator(indText);
            if (indikator) {
                const pertanyaanMatch = indText.match(/Pertanyaan\s*:\s*(.+?)\nTingkat/s);
                const pertanyaan = pertanyaanMatch ? pertanyaanMatch[1].replace(/\n/g, ' ').trim() : '';
                const contentStart = indText.indexOf('Kriteria');
                const contentEnd = indText.indexOf('Jawaban');
                let content = indText.substring(contentStart+8, contentEnd).trim();
                if (content.startsWith("1\n")) {
                  content = content.slice(2); 
                }
                data.push({
                    metadata: {
                        domain: currentDomain,
                        aspek: currentAspek,
                        indikator: indikator,
                        pertanyaan: pertanyaan
                    },
                    content: content,
                    section_type: getSectionType(currentDomain, currentAspek, indikator),
                    content_length: content.length,
                    word_count: content.split(/\s+/).length,
                });
            }
        }
    }

    return data;
}

const text = fs.readFileSync('extracted_text.txt', 'utf8');
const cleanedText = cleanText(text);
const sectionsData = extractSections(cleanedText);

fs.writeFileSync('extracted_data.json', JSON.stringify(sectionsData, null, 4), 'utf8');
console.log('Extraction complete. Data saved to extracted_data.json');
