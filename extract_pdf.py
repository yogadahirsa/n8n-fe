import pdfplumber
import re
import json

def clean_text(text):
    lines = text.split('\n')
    cleaned = []
    for line in lines:
        line = line.strip()
        if line:
            if cleaned and not re.search(r'[.!?:]$', cleaned[-1]):
                cleaned[-1] += ' ' + line
            else:
                cleaned.append(line)
    return '\n'.join(cleaned)

def parse_domain(text):
    match = re.search(r'Domain (\d+): (.+)', text)
    if match:
        return {
            "number": int(match.group(1)),
            "name": match.group(2).strip(),
            "label": f"Domain {match.group(1)}: {match.group(2).strip()}"
        }
    return None

def parse_aspek(text):
    match = re.search(r'Aspek (\d+): (.+)', text)
    if match:
        return {
            "number": int(match.group(1)),
            "name": match.group(2).strip(),
            "label": f"Aspek {match.group(1)}: {match.group(2).strip()}"
        }
    return None

def parse_indikator(text):
    match = re.search(r'Indikator (\d+): (.+)', text)
    if match:
        return {
            "number": int(match.group(1)),
            "name": match.group(2).strip(),
            "label": f"Indikator {match.group(1)}: {match.group(2).strip()}"
        }
    return None

def extract_sections(text):
    # Split text into sections based on Domain
    domain_pattern = r'(?=Domain \d+:)'
    sections = re.split(domain_pattern, text)
    sections = [s.strip() for s in sections if s.strip()]

    data = []
    current_domain = None
    current_aspek = None

    for section in sections:
        domain = parse_domain(section)
        if domain:
            current_domain = domain
            # Find aspek in this section
            aspek_match = re.search(r'Aspek \d+: .+?(?=Indikator \d+:|$)', section, re.DOTALL)
            if aspek_match:
                current_aspek = parse_aspek(aspek_match.group(0))
            else:
                current_aspek = None
        else:
            # If no domain, perhaps continuation or error
            continue

        # Find all indikator in this section
        indikator_pattern = r'Indikator \d+: .+?(?=Indikator \d+:|Aspek \d+:|Domain \d+:|$)'
        indikators = re.findall(indikator_pattern, section, re.DOTALL)

        for ind_text in indikators:
            indikator = parse_indikator(ind_text)
            if indikator:
                # Extract content after the indikator label
                content_match = re.search(r'Indikator \d+: .+?\n(.+)', ind_text, re.DOTALL)
                content = content_match.group(1).strip() if content_match else ""
                data.append({
                    "metadata": {
                        "domain": current_domain,
                        "aspek": current_aspek,
                        "indikator": indikator
                    },
                    "content": content
                })

    return data

# Main
with pdfplumber.open('public/sample.pdf') as pdf:
    text = ''
    for page_num in range(29, 77):  # Pages 30-77 (0-indexed 29-76)
        if page_num < len(pdf.pages):
            page = pdf.pages[page_num]
            page_text = page.extract_text()
            if page_text:
                text += page_text + '\n'

cleaned_text = clean_text(text)
sections_data = extract_sections(cleaned_text)

with open('extracted_data.json', 'w', encoding='utf-8') as f:
    json.dump(sections_data, f, ensure_ascii=False, indent=4)

print("Extraction complete. Data saved to extracted_data.json")