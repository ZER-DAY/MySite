const puppeteer = require('puppeteer');

async function searchEmailsOnAllPages(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // افتح الصفحة الرئيسية
  await page.goto(url);

  // احصل على جميع الروابط من الصفحة الرئيسية
  const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));

  // قم بزيارة كل رابط والبحث عن البريد الإلكتروني
  for (const link of links) {
    const newPage = await browser.newPage();
    await newPage.goto(link);

    const bodyHandle = await newPage.$('body');
    const textContent = await newPage.evaluate(body => body.innerText, bodyHandle);
    await bodyHandle.dispose();

    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const foundEmails = textContent.match(emailPattern);

    if (foundEmails) {
      console.log(`تم العثور على عناوين بريد إلكتروني في ${link}:`);
      foundEmails.forEach(email => console.log(email));
    } else {
      console.log(`لم يتم العثور على عناوين بريد إلكتروني في ${link}`);
    }

    await newPage.close();
  }

  await browser.close();
}

// استبدل "https://example.com" بعنوان الموقع الذي تريد البحث فيه
searchEmailsOnAllPages('https://www.amazon.com/');
