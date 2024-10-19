function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play.type, perf.audience);
    volumeCredits += calculateCredits(play.type, perf.audience);
    totalAmount += thisAmount;

    // 청구 내역을 출력한다.
    result += `  ${play.name}: ${formatUSD(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
  }
  result += `총액: ${formatUSD(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

function htmlStatement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `<h1>청구 내역 (고객명: ${invoice.customer})</h1>\n`;
  result += "<table>\n";
  result += "  <tr><th>연극</th><th>좌석수</th><th>금액</th></tr>\n";

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play.type, perf.audience);
    volumeCredits += calculateCredits(play.type, perf.audience);
    totalAmount += thisAmount;

    // 청구 내역을 출력한다.
    result += `  <tr><td>${play.name}</td><td>(${perf.audience}석)</td>`;
    result += `<td>${formatUSD(thisAmount / 100)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>총액: <em>${formatUSD(totalAmount / 100)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${volumeCredits}점</em></p>\n`;
  return result;
}

function calculateAmount(type, audience) {
  let thisAmount = 0;
  switch (type) {
    case "tragedy": // 비극
      thisAmount = 40000;
      if (audience > 30) {
        thisAmount += 1000 * (audience - 30);
      }
      break;
    case "comedy": // 희극
      thisAmount = 30000;
      if (audience > 20) {
        thisAmount += 10000 + 500 * (audience - 20);
      }
      thisAmount += 300 * audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${type}`);
  }
  return thisAmount;
}

function calculateCredits(type, audience) {
  // 포인트를 적립한다.
  let volumeCredits = Math.max(audience - 30, 0);
  // 희극 관객 5명마다 추가 포인트를 제공한다.
  if ("comedy" === type) volumeCredits += Math.floor(audience / 5);
  return volumeCredits;
}

function formatUSD(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

module.exports = { statement, htmlStatement };
