import fs from 'fs';
import pdfParse from 'pdf-parse';

function cleanText(text) {
    const lines = text.split('\n');
    const cleaned = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) {
            if (cleaned.length > 0 && !/[.!?:]$/.test(cleaned[cleaned.length - 1])) {
                cleaned[cleaned.length - 1] += ' ' + trimmed;
            } else {
                cleaned.push(trimmed);
            }
        }
    }
    return cleaned.join('\n');
}

function parseDomain(text) {
    const match = text.match(/Domain (\d+): (.+)/);
    if (match) {
        return {
            number: parseInt(match[1]),
            name: match[2].trim(),
            label: `Domain ${match[1]}: ${match[2].trim()}`
        };
    }
    return null;
}

function parseAspek(text) {
    const match = text.match(/Aspek (\d+): (.+)/);
    if (match) {
        return {
            number: parseInt(match[1]),
            name: match[2].trim(),
            label: `Aspek ${match[1]}: ${match[2].trim()}`
        };
    }
    return null;
}

function parseIndikator(text) {
    const match = text.match(/Indikator (\d+): (.+)/);
    if (match) {
        return {
            number: parseInt(match[1]),
            name: match[2].trim(),
            label: `Indikator ${match[1]}: ${match[2].trim()}`
        };
    }
    return null;
}

function extractSections(text) {
    const domainPattern = /(?=Domain \d+:)/g;
    const sections = text.split(domainPattern).filter(s => s.trim());

    const data = [];
    let currentDomain = null;
    let currentAspek = null;

    for (const section of sections) {
        const domain = parseDomain(section);
        if (domain) {
            currentDomain = domain;
            const aspekMatch = section.match(/Aspek \d+: .+?(?=Indikator \d+:|$)/s);
            if (aspekMatch) {
                currentAspek = parseAspek(aspekMatch[0]);
            } else {
                currentAspek = null;
            }
        } else {
            continue;
        }

        const indikatorPattern = /Indikator \d+: .+?(?=Indikator \d+:|Aspek \d+:|Domain \d+:|$)/gs;
        const indikators = section.match(indikatorPattern) || [];

        for (const indText of indikators) {
            const indikator = parseIndikator(indText);
            if (indikator) {
                const contentMatch = indText.match(/Indikator \d+: .+?\n(.+)/s);
                const content = contentMatch ? contentMatch[1].trim() : '';
                data.push({
                    metadata: {
                        domain: currentDomain,
                        aspek: currentAspek,
                        indikator: indikator
                    },
                    content: content
                });
            }
        }
    }

    return data;
}

const dataBuffer = fs.readFileSync('public/sample.pdf');

pdfParse(dataBuffer).then(function(data) {
    let extractedText = '';
    data.pages.forEach((page, index) => {
        if (index >= 29 && index <= 76) { // Pages 30-77 (0-indexed 29-76)
            extractedText += page.text + '\n';
        }
    });

    const cleanedText = cleanText(extractedText);
    const sectionsData = extractSections(cleanedText);

    fs.writeFileSync('extracted_data.json', JSON.stringify(sectionsData, null, 4), 'utf8');
    console.log('Extraction complete. Data saved to extracted_data.json');
}).catch(function(error) {
    console.error('Error parsing PDF:', error);
});