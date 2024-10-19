function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play.type, perf.audience);
    volumeCredits += calculateCredits(play.type, perf.audience);

    // 청구 내역을 출력한다.
    result += `  ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
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

module.exports = { statement };
