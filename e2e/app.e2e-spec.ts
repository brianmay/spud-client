import { SpudClientPage } from './app.po';

describe('spud-client App', () => {
  let page: SpudClientPage;

  beforeEach(() => {
    page = new SpudClientPage();
  });

  it('should display message saying app works', async () => {
    page.navigateTo();
    expect(await page.getParagraphText()).toBe('Album List');
  });
});
