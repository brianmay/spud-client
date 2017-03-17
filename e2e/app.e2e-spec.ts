import { SpudClientPage } from './app.po';

describe('spud-client App', () => {
  let page: SpudClientPage;

  beforeEach(() => {
    page = new SpudClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
