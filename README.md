# COVID-19 visualisation tool

An interactive visualisation of coronavirus (COVID-19) cases in Victoria. This repository replaces
an older version of the tool, which ran from July 2020 to December 2021. Built and maintained by
[@hrs_andrabi](https://twitter.com/hrs_andrabi). Contact me at hrs.andrabi@gmail.com.

## Data

Data is sourced directly from the Department of Health [COVID-19 data
portal](https://www.coronavirus.vic.gov.au/victorian-coronavirus-covid-19-data). The exact data used
for plotting is available
[here](https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9oKYNQhJ6v85dQ9qsybfMfc-eaJ9oKVDZKx-VGUr6szNoTbvsLTzpEaJ3oW_LZTklZbz70hDBUt-d/pub?gid=0&single=true&output=csv),
and updated daily by the Department of Health. Sometimes the Department of Health forgets to update
their dashboard, which causes the visualisation tool to be a out of date.

## Oh no, it's broken

This will happen everytime the Department of Health makes changes to the structure of the input
datafile. You can try and fix it via a PR, or raise an issue and I will fix it as soon as I can.
