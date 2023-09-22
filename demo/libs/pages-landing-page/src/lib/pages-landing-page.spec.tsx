import { render } from '@testing-library/react';

import PagesLandingPage from './pages-landing-page';

describe('PagesLandingPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PagesLandingPage />);
    expect(baseElement).toBeTruthy();
  });
});
