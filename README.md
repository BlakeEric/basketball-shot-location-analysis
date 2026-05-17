# Basketball Shot Analysis By Court Location
https://basketball-shot-location-analysis.vercel.app/

This is a Proof of Concept for an application that analyzes basketball shot data by court location, providing insights into shooting patterns and efficiency, and performance across different areas of the court. The tool helps players and coaches understand where on the court shots are most effective and identify areas for improvement. Filters can be applied to focus on  specific players and date ranges during a single NBA season.

### Usage
Filter data by court location by clicking and dragging on an area of the court:
IMAGE HERE

Narrow results by filtering by date range and specific players
IMAGE HERE

## Assumptions

This Proof of Concept assumes that coaches/players already have access to the same raw spreadsheet data used in this applicataion, and therefor visual data representation is more interesting than data tables. An assumption was also made that users would want use this applications for spotting long-term trends rather than for analyzing data for a specific games.

Finally, it is assumed that players/coaches would not use mobile devices when using the application, so the layout is not responsive on small screens.

## Technologies
* TypeScript
* React
* Vite
* Tailwind (css utilities)
* Ant Design (UI component library)
* Recharts (chart library)

## Tradeoffs

In order to get a working example up and running quickly, this is a purely static frontend application made using react/vite and third party libraries. No unit testing was added, since this POC would likely be rewritten/replaced after its usability was validated. 

Since the part I was most interested in demonstrating was the visual court location filtering, the data is imported directly from the CSV and filtered on the client. If this were a real application the data would be stored in relational database and processed via an API. In addition, to keep this initial version of the application as simple as possible, I have only chosen to display a couple metrics in the resulting charts at this point.

## Potential Improvements

If I was able to invest more time in this project I would:
* add vitest and write tests for all components
* move data to a relational DB and query via an API
* Add many more filters and datapoints to the visible charts
* Add shot success heatmap within the selected court area  
* Add responsive styling
