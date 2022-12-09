import { render, renderWithProviders, screen } from "../../test-utils"
import { Weather } from "./Weather";


describe(Weather, () => {
    it("current weather displays correct city name", async () => {
        renderWithProviders(<Weather />, {
            preloadedState: {
                currentLocation: 'Seattle'
            }
        });
        const currentWeatherHeader = await screen.findByTestId("current-city")
        expect(currentWeatherHeader).toBeInTheDocument();
    })
});