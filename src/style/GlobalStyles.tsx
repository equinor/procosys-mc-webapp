import styled, { CSSObject } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { createGlobalStyle } from 'styled-components';

export const SHADOW =
    '0 0.3px 0.9px rgba(33, 41, 43, 0.04), 0 0.9px 3.1px rgba(33, 41, 43, 0.07), 0 4px 14px rgba(33, 41, 43, 0.1)';

export const COLORS = {
    mossGreen: tokens.colors.interactive.primary__resting.hex,
    fadedBlue: tokens.colors.interactive.primary__hover_alt.hex,
    danger: tokens.colors.interactive.danger__resting.hex,
    success: tokens.colors.interactive.success__resting.hex,
    moss: tokens.colors.interactive.link_on_interactive_colors.hex,
    white: '#fff',
    darkGrey: '#757575',
    lightGrey: '#fafafa',
    black: '#000',
    greyBackground: tokens.colors.ui.background__light.hex,
    workOrderIcon: '#990025',
    tagIcon: '#007079',
    purchaseOrderIcon: '#879199',
    ipoIcon: '#a740a1',
    disabledText: tokens.colors.interactive.disabled__text.hex,
};

const GlobalStyles = createGlobalStyle`
    body { 
        margin: 0 auto;
        padding-top: 54px;
        max-width: 768px;
        box-shadow: ${SHADOW};
    }
    h1 {
        ${tokens.typography.heading.h1 as CSSObject}
    }
    h2 {
        ${tokens.typography.heading.h2 as CSSObject}
    }
    h3 {
        ${tokens.typography.heading.h3 as CSSObject}
    }
    h4 {
        ${tokens.typography.heading.h4 as CSSObject}
    }
    h5 {
        ${tokens.typography.heading.h5 as CSSObject}
    }
    h6 {
        ${tokens.typography.heading.h6 as CSSObject}
    }
    p {
        ${tokens.typography.paragraph.body_short as CSSObject}
    }
    a {
        ${tokens.typography.paragraph.body_short_link as CSSObject}
    }
    hr {
        width: 100%;
    }
    label {
        ${tokens.typography.input.label as CSSObject}
    }
    main {
        background-color: ${COLORS.white};
        min-height: calc(100vh - 55px);
    }
`;

const ParagraphOverlineImport = styled.p(tokens.typography.paragraph.overline);

export const ParagraphOverline = styled(ParagraphOverlineImport)`
    margin: 0;
`;

export const Caption = styled.p(tokens.typography.paragraph.caption);

export const BREAKPOINT = {
    xs: '@media (max-width: 0px)',
    sm: '@media (max-width: 600px)',
    standard: '@media (max-width: 768px)',
    md: '@media (max-width: 960px)',
    lg: '@media (max-width: 1280px)',
    xl: '@media (max-width: 1920px)',
};

export default GlobalStyles;
