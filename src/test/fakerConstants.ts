export const TagSyntax = 'XXX-AA-XXXX-A-A-XX';
/**
 * One Alpha: [a-zA-Z]{1}
 * Two Alpha: [a-zA-Z]{2}
 * 'n' Alpha: [a-zA-Z]{n}
 *
 * One number: [0-9]{1}
 * Two number: [0-9]{2}
 * 'n' number: [0-9]{n}
 */
export const TagSyntaxRegex = new RegExp(
    '^[0-9]{3}-[a-zA-Z]{2}-[0-9]{4}-[a-zA-Z]{1}-[a-zA-Z]{1}-[0-9]{2}'
);
export const PurchaseOrderNo = 'XXX-XXX-AA-X';
export const TagFunctionCodeSyntax = 'XXX-AAA-XXX';
export const SystemCodeSyntax = 'XXX-XXX-XXX';
