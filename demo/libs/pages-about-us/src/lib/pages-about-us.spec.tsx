import { render } from '@testing-library/react';

import PagesAboutUs from './pages-about-us';

describe('PagesAboutUs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PagesAboutUs />);
    expect(baseElement).toBeTruthy();
  });
});
