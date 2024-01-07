export class GridElement extends HTMLElement {}
customElements.define('techteam-grid',GridElement);
export class TileElement extends HTMLElement {}
customElements.define('techteam-tile',TileElement);
export class TileTitleElement extends HTMLElement {}
customElements.define('techteam-tile-title',TileTitleElement);
export class TileLeftCornerElement extends HTMLElement {}
customElements.define('techteam-tile-left-corner',TileLeftCornerElement);
export class TileRightCornerElement extends HTMLElement {}
customElements.define('techteam-tile-right-corner',TileRightCornerElement);
export class ImageWrapperElement extends HTMLElement {}
customElements.define('techteam-image-wrapper',ImageWrapperElement);

//Helper to add JSX types in *.tsx files
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T,K>>;
export type JSXify<T extends Element> = Partial<
    Omit<T,'children'> & {children?: HTMLElement[]|HTMLElement}
    >;

    declare global{
        // eslint-disable-next-line @typescript-eslint/no-namespace
        namespace JSX{
            interface IntrinsicElements{
                'techteam-grid':JSXify<GridElement>;
                'techteam-tile':JSXify<TileElement>;
                'techteam-tile-title':JSXify<TileTitleElement>;
                'techteam-tile-left-corner':JSXify<TileLeftCornerElement>;
                'techteam-tile-right-corner':JSXify<TileRightCornerElement>;
                'techteam-image-wrapper':JSXify<ImageWrapperElement>;
            }
        }
    }