DAX sample model

Summarize this article for me
The Adventure Works DW 2020 Power BI Desktop sample model is designed to support your DAX learning. The model is based on the Adventure Works data warehouse sample for AdventureWorksDW2017—however, the data has been modified to suit the objectives of the sample model.

The sample model does not contain any DAX formulas. It does however support hundreds or even thousands of potential calculation formulas and queries. Some function examples, like those in CALCULATE, DATESBETWEEN, DATESIN PERIOD, IF, and LOOKUPVALUE can be added to the sample model without modification. We're working on including more examples in other function reference articles that work with the sample model.

Scenario
An image of the Adventure Works company logo is shown.

The Adventure Works company represents a bicycle manufacturer that sells bicycles and accessories to global markets. The company has their data warehouse data stored in an Azure SQL Database.

Model structure
The model has seven tables:

Table	Description
Customer	Describes customers and their geographic location. Customers purchase products online (Internet sales).
Date	There are three relationships between the Date and Sales tables, for order date, ship date, and due date. The order date relationship is active. The company's reports sales using a fiscal year that commences on July 1 of each year. The table is marked as a date table using the Date column.
Product	Stores finished products only.
Reseller	Describes resellers and their geographic location. Reseller on sell products to their customers.
Sales	Stores rows at sales order line grain. All financial values are in US dollars (USD). The earliest order date is July 1, 2017, and the latest order date is June 15, 2020.
Sales Order	Describes sales order and order line numbers, and also the sales channel, which is either Reseller or Internet. This table has a one-to-one relationship with the Sales table.
Sales Territory	Sales territories are organized into groups (North America, Europe, and Pacific), countries, and regions. Only the United States sells products at the region level.
Download sample
Download the Power BI Desktop sample model file here.

Related content
Learning path: Use DAX in Power BI Desktop
Questions? Try asking the Power BI Community
Suggestions? Contribute ideas to improve Power BI
Additional resources
Documentation

DAX overview - DAX

Describes the Data Analysis Expressions (DAX) language.

Learn DAX videos - DAX

Describes helpful videos used to learn Data Analysis Expressions (DAX) language.

Understanding ORDERBY, PARTITIONBY, and MATCHBY functions in DAX - DAX

Best practices for using ORDERBY, PARTITIONBY, and MATCHBY functions.

Show 4 more
Training

Learning path

Model Data with Power BI - Training

Data modeling configures and shapes your prepared data to design a semantic model with the necessary relationships and calculations using Data Analysis Expressions (DAX). This process ensures accurate analysis and sets you up to create clear, impactful Power BI reports.

Certification

Microsoft Certified: Power BI Data Analyst Associate - Certifications

Demonstrate methods and best practices that align with business and technical requirements for modeling, visualizing, and analyzing data with Microsoft Power BI.

