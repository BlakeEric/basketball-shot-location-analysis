# Basketball Shot Analysis By Court Location
Link to live app: https://basketball-shot-location-analysis.vercel.app/

This is a Proof of Concept for an application that analyzes basketball shot data by court location, providing insights into shooting patterns and efficiency, and performance across different areas of the court. The tool helps players and coaches understand where on the court shots are most effective and identify areas for improvement. Filters can be applied to focus on specific players and date ranges during a single NBA season.

### Usage
Filter data by court location by clicking and dragging on an area of the court:

<img width="400" alt="clip" src="https://github.com/user-attachments/assets/68261896-b9f8-4ff5-8005-b26076356c38" />

Narrow results by date range and specific players:

<img width="400" alt="Screenshot 2026-05-17 at 14 02 07" src="https://github.com/user-attachments/assets/c5893af2-2416-4f09-8766-f6d70d39fbc1" />

Hover over graphs to see more detailed data:

<img width="685" height="524" alt="Screenshot 2026-05-18 at 17 12 43" src="https://github.com/user-attachments/assets/325f60f7-b9bc-460c-bc68-89814c024d00" />

### Running locally

This application can be run locally by following the following steps:
* Clone the repo: `git clone git@github.com:BlakeEric/basketball-shot-location-analysis.git`
* Run `npm install` from the root directory
* Run `npm run dev` from the root directory

## Assumptions

I also chose not to use any AI coding agents because I assume it is easier to evaluate my skills in this exercise without AI support.

This Proof of Concept assumes that end users want interactive, visual data representation. An assumption was also made that users want to use this application for spotting long-term trends rather than analyzing data for a specific game. Finally, it is assumed that users would view the application on desktop devices rather than mobile devices.

## Technologies
The following tools were used with the goal of rapidly creating a prototype for client-side data visualization. 

* TypeScript
* React
* Vite
* Tailwind (CSS utilities)
* Ant Design (UI component library)
* Recharts (chart library)

## Tradeoffs

In order to get a working example up and running quickly, this is a purely static frontend application made using React/Vite and third-party libraries. No unit testing was added since this POC would likely be rewritten/replaced after its usability was validated. 

Since the part I was most interested in demonstrating was the visual court location filtering, the data is imported directly from the CSV and filtered on the client. If this were a real application, the data would be stored in a relational database and processed via an API. To keep this initial version of the application as simple as possible, I have chosen to display a few metrics clearly rather than multiple metrics in an overwhelming dashboard.

## Potential Improvements

Next steps if the dataset were much larger and this were a production app:
* move data to a relational DB and query via an API
* Add many more filters and datapoints to the visible charts
* Add shot success heatmap within the selected court area  
* conduct user testing to validate usability
* add vitest and write tests for all components
