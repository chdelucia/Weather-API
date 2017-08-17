import { MediacoachportalPage } from './app.po';

describe('mediacoachportal App', () => {
  let page: MediacoachportalPage;

  beforeEach(() => {
    page = new MediacoachportalPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
