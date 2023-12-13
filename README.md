# Google App Scripts for Snipe-IT

**[Snipe-IT](https://snipeitapp.com)** prides itself on letting you move _away_ from spreadsheets and Google Sheets, but there are times when you need to run a one-off script and you might not have the time (or programming resources) to create your on bespoke solution to one-off data manipulation. 

This repository contains a collection of Google App Scripts that can be used to manipulate data in your Snipe-IT instance quickly and easily.

## Using Google App Scripts

When you have a Google Sheet with data in it and you'd like to run a Google App script on it, go to the sheet that contains the data in it and within the Sheets UI, go to  `Extensions`, then `Apps Script`. 

<img width="434" alt="Screenshot 2023-12-13 at 4 52 28 PM" src="https://github.com/grokability/google-apps-scripts-for-snipe-it/assets/197404/38737920-aca3-4879-b68e-47ad97f5592a">


This will open the Apps Script editor. From there you can either copy and paste the code from the appropriate scripts in this repo, or add the script file using the left-side File menu in the Sheets UI.

## Important!

These scripts are *by design* data destructive. Please always make sure you [run a backup](https://snipe-it.readme.io/docs/backups) by going to `Admin Settings > Backups` before running them. That way if something gets messed up, you can easily restore to a known good point.

## Using these Scripts

Each script lives in it's own directory within the repo. You will find a readme file within each directory that explains customizations (such as BREARER-TOKENS, your API endpoint, etc) that need to be made to the script before you can run it.
