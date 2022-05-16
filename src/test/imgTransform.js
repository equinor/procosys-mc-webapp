export function process() {
    return 'module.exports = {};';
}
export function getCacheKey() {
    // The output is always the same.
    return 'svgTransform';
}
