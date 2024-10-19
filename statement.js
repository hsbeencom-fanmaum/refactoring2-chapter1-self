function statement(invoice, plays) {
  const invoiceGenerator = new InvoiceGenerator(invoice, plays);
  return invoiceGenerator.renderPlainText();
}

function htmlStatement(invoice, plays) {
  const invoiceGenerator = new InvoiceGenerator(invoice, plays);
  return invoiceGenerator.renderHtmlText();
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

class InvoiceGenerator {
  constructor(invoice, plays) {
    this.invoice = invoice;
    this.plays = plays;
    this.#clearInovice();
  }

  #clearInovice() {
    this.totalAmount = 0;
    this.volumeCredits = 0;
  }

  renderPlainText() {
    this.#clearInovice();
    let result = `청구 내역 (고객명: ${this.invoice.customer})\n`;

    for (let perf of this.invoice.performances) {
      const play = this.plays[perf.playID];
      let thisAmount = calculateAmount(play.type, perf.audience);
      this.volumeCredits += calculateCredits(play.type, perf.audience);
      this.totalAmount += thisAmount;

      // 청구 내역을 출력한다.
      result += `  ${play.name}: ${formatUSD(thisAmount / 100)} (${
        perf.audience
      }석)\n`;
    }
    result += `총액: ${formatUSD(this.totalAmount / 100)}\n`;
    result += `적립 포인트: ${this.volumeCredits}점\n`;
    return result;
  }

  renderHtmlText() {
    this.#clearInovice();
    let result = `<h1>청구 내역 (고객명: ${this.invoice.customer})</h1>\n`;
    result += "<table>\n";
    result += "  <tr><th>연극</th><th>좌석수</th><th>금액</th></tr>\n";

    for (let perf of this.invoice.performances) {
      const play = this.plays[perf.playID];
      let thisAmount = calculateAmount(play.type, perf.audience);
      this.volumeCredits += calculateCredits(play.type, perf.audience);
      this.totalAmount += thisAmount;

      // 청구 내역을 출력한다.
      result += `  <tr><td>${play.name}</td><td>(${perf.audience}석)</td>`;
      result += `<td>${formatUSD(thisAmount / 100)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>총액: <em>${formatUSD(this.totalAmount / 100)}</em></p>\n`;
    result += `<p>적립 포인트: <em>${this.volumeCredits}점</em></p>\n`;
    return result;
  }
}

module.exports = { statement, htmlStatement };
