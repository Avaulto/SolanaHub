import {AirdropsFinderService} from "../airdrops-finder.service";

class AirdropsFinderServiceMock {
}

export const AirdropsFinderServiceMockProvider = {
  provide: AirdropsFinderService,
  useClass: AirdropsFinderServiceMock
}
