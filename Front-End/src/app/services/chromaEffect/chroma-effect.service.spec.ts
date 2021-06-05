import {ChromaEffectService} from './chroma-effect.service'

describe('ChromaEffectService', () => {
    let sut: ChromaEffectService

    beforeEach(() => {
        const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['readGeneralSettings', 'saveGeneralSettings'])
        sut = new ChromaEffectService(settingsServiceMock)
    })

    it('should be created', () => {
        expect(sut).toBeTruthy()
    })
})
