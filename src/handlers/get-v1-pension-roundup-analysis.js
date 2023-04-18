const defaultUserId = '6436893ffbb6a3eaca4e2d06'

const getV1PensionRoundupAnalysis = async (ctx) => {
  const userId = ctx.request.query.userId || defaultUserId
  const { enableMinimumRounding = false, minimumRoundingValue = 0.1 } = ctx.request.query

  const accounts = await ctx.moneyHub.getAccounts({
    userId,
    params: {}
  }).then(res => res.data)

  const pensions = accounts.filter((account) => {
    return account.type.includes('pension')
  })

  const currentPensionValue = 20100.12
  // const currentPensionValue = pensions.reduce((totalValue, pension) => {
  //   return totalValue + pension.balance.amount.value / 100
  // }, 0)

  const todaysDate = new Date().toISOString().substring(0, 10)
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() -1)).toISOString().substring(0, 10)

  const transactions = await ctx.moneyHub.getTransactions({
    userId,
    params: {
      startDate: lastMonth,
      endDate: todaysDate
    }
  }).then(res => res.data)

  const transactionsToRoundUp = transactions.filter((transaction) => {
    return enableMinimumRounding === 'true' || transaction.amount.minorUnits > 0
  })

  const valueIncreaseViaRounding = transactionsToRoundUp.reduce((valueIncrease, transaction) => {
    let difference = transaction.amount.minorUnits > 0 ? 100 - transaction.amount.minorUnits : 0

    if (enableMinimumRounding && (minimumRoundingValue * 100) > difference) {
      difference = (minimumRoundingValue * 100)
    }

    return valueIncrease + difference
  }, 0) / 100

  const futureValue = {}

  let month = 1
  let pensionValue = currentPensionValue
  let pensionValueWithRoundups = currentPensionValue

  while (month < 481) {
    const monthlyInterest = pensionValue * 0.04 / 12
    pensionValue = parseFloat(parseFloat(pensionValue + monthlyInterest).toFixed(2))

    const monthlyInterestWithRoundups = pensionValueWithRoundups * 0.04 / 12
    pensionValueWithRoundups = parseFloat(parseFloat(pensionValueWithRoundups + monthlyInterestWithRoundups + valueIncreaseViaRounding).toFixed(2))

    if (month === 12) {
      futureValue.oneYear = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    if (month === 36) {
      futureValue.threeYears = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    if (month === 60) {
      futureValue.fiveYears = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    if (month === 120) {
      futureValue.tenYears = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    if (month === 180) {
      futureValue.fifteenYears = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    if (month === 240) {
      futureValue.twentyYears = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    if (month === 300) {
      futureValue.twentyFiveYears = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    if (month === 360) {
      futureValue.thirtyYears = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    if (month === 420) {
      futureValue.thirtyFiveYears = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    if (month === 480) {
      futureValue.fortyYears = {
        amountWithoutRoundups: pensionValue,
        amountWithRoundups: pensionValueWithRoundups,
        difference: parseFloat(parseFloat(pensionValueWithRoundups - pensionValue).toFixed(2))
      }
    }
    month++
  }

  ctx.body = {
    currentValue: currentPensionValue,
    transactionsStartDate: lastMonth,
    transactionsEndDate: todaysDate,
    noOfTransactionsInMonth: transactions.length,
    noOfTransactionsToRound: transactionsToRoundUp.length,
    valueIncreaseViaRounding,
    futureValue
  }
}

module.exports = {
  getV1PensionRoundupAnalysis
}
