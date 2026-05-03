import WidgetKit
import SwiftUI

// MARK: - Data Model

struct WeatherEntry: TimelineEntry {
  let date: Date
  let temperature: Int
  let weatherCode: Int
  let city: String
}

// MARK: - Provider

struct WeatherProvider: TimelineProvider {
  func placeholder(in context: Context) -> WeatherEntry {
    WeatherEntry(date: Date(), temperature: 22, weatherCode: 0, city: "Mi ciudad")
  }

  func getSnapshot(in context: Context, completion: @escaping (WeatherEntry) -> Void) {
    completion(loadEntry())
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<WeatherEntry>) -> Void) {
    let entry = loadEntry()
    // Refresh every 30 minutes
    let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
    let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
    completion(timeline)
  }

  private func loadEntry() -> WeatherEntry {
    let defaults = UserDefaults(suiteName: "group.com.loj.weatherapp")
    let temperature = defaults?.integer(forKey: "widget_temperature") ?? 0
    let weatherCode = defaults?.integer(forKey: "widget_weather_code") ?? 0
    let city = defaults?.string(forKey: "widget_city") ?? "—"
    return WeatherEntry(date: Date(), temperature: temperature, weatherCode: weatherCode, city: city)
  }
}

// MARK: - Views

struct WeatherWidgetView: View {
  var entry: WeatherEntry
  @Environment(\.widgetFamily) var family

  var body: some View {
    ZStack {
      gradient
      content
    }
    .containerBackground(for: .widget) { gradient }
  }

  private var gradient: some View {
    LinearGradient(
      colors: [
        Color(red: 0.08, green: 0.40, blue: 0.78),
        Color(red: 0.04, green: 0.18, blue: 0.48),
      ],
      startPoint: .topLeading,
      endPoint: .bottomTrailing
    )
  }

  private var content: some View {
    VStack(spacing: 4) {
      Text(entry.city)
        .font(.caption)
        .foregroundColor(.white.opacity(0.85))
        .lineLimit(1)
        .padding(.horizontal, 8)

      Text("\(entry.temperature)°")
        .font(.system(size: family == .systemSmall ? 48 : 60, weight: .thin))
        .foregroundColor(.white)

      Text(weatherEmoji(for: entry.weatherCode))
        .font(family == .systemSmall ? .title2 : .title)

      if family == .systemMedium {
        Text(weatherDescription(for: entry.weatherCode))
          .font(.caption2)
          .foregroundColor(.white.opacity(0.75))
      }
    }
  }

  private func weatherEmoji(for code: Int) -> String {
    switch code {
    case 0:        return "☀️"
    case 1:        return "🌤️"
    case 2:        return "⛅"
    case 3:        return "☁️"
    case 45, 48:   return "🌫️"
    case 51...55:  return "🌦️"
    case 61...67:  return "🌧️"
    case 71...77:  return "❄️"
    case 80...82:  return "🌦️"
    case 85, 86:   return "🌨️"
    case 95...99:  return "⛈️"
    default:       return "🌤️"
    }
  }

  private func weatherDescription(for code: Int) -> String {
    switch code {
    case 0:        return "Despejado"
    case 1:        return "Mayormente despejado"
    case 2:        return "Parcialmente nublado"
    case 3:        return "Nublado"
    case 45, 48:   return "Neblina"
    case 51...55:  return "Llovizna"
    case 61...67:  return "Lluvia"
    case 71...77:  return "Nieve"
    case 80...82:  return "Chubascos"
    case 85, 86:   return "Chubascos de nieve"
    case 95...99:  return "Tormenta"
    default:       return "—"
    }
  }
}

// MARK: - Widget Configuration

@main
struct WeatherWidget: Widget {
  let kind: String = "WeatherWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WeatherProvider()) { entry in
      WeatherWidgetView(entry: entry)
    }
    .configurationDisplayName("Clima")
    .description("Muestra el clima actual de tu ubicación.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

// MARK: - Preview

#Preview(as: .systemSmall) {
  WeatherWidget()
} timeline: {
  WeatherEntry(date: .now, temperature: 22, weatherCode: 0, city: "Buenos Aires")
  WeatherEntry(date: .now, temperature: 18, weatherCode: 61, city: "Buenos Aires")
}
