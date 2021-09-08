export function removeHtmlFromText(text?: string): string {
    if (text) {
        return text
            .replace(/<\/P>/g, '\n')
            .replace(/<P>/g, '')
            .replace(/<\/a>/g, '\n')
            .replace(/<a>/g, '')
            .replace(/<\/div>/g, '\n')
            .replace(/<div>/g, '')
            .replace(/<\/span>/g, '\n')
            .replace(/<span>/g, '')
            .replace(/<\/h1>/g, '\n')
            .replace(/<h1>/g, '')
            .replace(/<\/h2>/g, '\n')
            .replace(/<h2>/g, '')
            .replace(/<\/h3>/g, '\n')
            .replace(/<h3>/g, '')
            .replace(/<\/h4>/g, '\n')
            .replace(/<h4>/g, '')
            .replace(/<\/h6>/g, '\n')
            .replace(/<h6>/g, '')
            .replace(/<\/h6>/g, '\n')
            .replace(/<h6>/g, '');
    }
    return '';
}
