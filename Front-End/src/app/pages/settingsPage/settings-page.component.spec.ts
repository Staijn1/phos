import {SettingsPageComponent} from './settings-page.component'

describe('SettingsComponent', () => {
    let sut: SettingsPageComponent

    beforeEach(() => {
        const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['readGeneralSettings', 'saveGeneralSettings'])

        sut = new SettingsPageComponent(settingsServiceMock)
    })

    it('should create', () => {
        expect(sut).toBeTruthy()
    })
})
