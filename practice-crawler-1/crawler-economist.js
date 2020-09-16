const puppeteer = require("puppeteer");
const fs = require("fs");
const schedule = require("node-schedule");

var gatherNewsItems = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const newsTitles = await getNewsTitles(page);
  console.log(newsTitles);

  fs.writeFile(
    "./data/newsitems-the-economist.json",
    JSON.stringify(newsTitles),
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log("created!");
      }
    }
  );

  await browser.close();
};

async function getNewsTitles(page) {
  await page.goto("https://www.economist.com/");
  return (results = await page.evaluate(() => {
    const allTitles = document.querySelectorAll(".teaser__headline", {
      waitUntil: "networkidle2",
    });
    return Array.from(allTitles).map((title) => {
      let res = {
        title: title.textContent,
        link: title["href"],
      };
      return res;
    });
  }));
}

schedule.scheduleJob("30 * * * * *", () => {
  console.log("gathering news!");
  gatherNewsItems();
});