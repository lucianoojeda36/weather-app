import Foundation
import WidgetKit

@objc(WeatherWidgetBridge)
class WeatherWidgetBridge: NSObject {

  @objc
  func setWidgetData(_ temperature: NSNumber, weatherCode: NSNumber, city: String) {
    let defaults = UserDefaults(suiteName: "group.com.loj.weatherapp")
    defaults?.set(temperature.intValue, forKey: "widget_temperature")
    defaults?.set(weatherCode.intValue, forKey: "widget_weather_code")
    defaults?.set(city, forKey: "widget_city")
    defaults?.synchronize()

    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
