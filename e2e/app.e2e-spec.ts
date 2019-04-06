import { HrChainFrontendPage } from './app.po';

describe('hr-chain-frontend App', function() {
  let page: HrChainFrontendPage;

  beforeEach(() => {
    page = new HrChainFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
