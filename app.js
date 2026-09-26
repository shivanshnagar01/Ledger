const supaUrl = "https://jfkzlnhlstdzdoytbfsd.supabase.co";
const supaKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impma3psbmhsc3RkemRveXRiZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NTA2MjAsImV4cCI6MjEwNDUyNjYyMH0.QvP411ch-8IFIYnlh615dcpBbAy_gGc5tzFOOhSs7rM";

const database = window.supabase.createClient(
    supaUrl,
    supaKey
);

async function checkUser() {
    const { data, error } = await database.auth.getUser();

    if (error) {
        console.log(error.message);
        return;
    }

    // console.log(data.user);
    user = data.user

    const { data: profile, error: profileError } = await database
        .from("profiles")
        .select("username")
        .eq("id", user.id);

    // console.log("profile:", profile);
    // console.log("profile error:", profileError);
    // console.log("Auth user ID:", user.id);
    if (profileError) {
        console.log(profileError.message);
        return;
    }

    userNameValueElem.innerText = profile[0].username;
}


checkUser();

const userNameValueElem = document.querySelector("#user-email")
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const categoryInput = document.querySelector("#category");
const descriptionInput = document.querySelector("#note");
const addTransactionBtn = document.querySelector("#addTransaction");
const container = document.querySelector("#transaction-list")

const notificationCard = document.querySelector(".notification")

const ThisMonthTotalElement = document.querySelector("#summary-total")
const ThisMonthTransCountElement = document.querySelector("#summary-count")
const LastMonthElement = document.querySelector("#summary-change")

const refreshInsight = document.querySelector("#insight-refresh")

const canvas = document.querySelector("#weeklyChart")
const ctx = canvas.getContext("2d")

const insightline = document.querySelector("#insight-text")

const chartTooltip = document.querySelector("#chart-tooltip");

const TooltipDate = chartTooltip.querySelector("#tooltip-date");
const TooltipType = chartTooltip.querySelector("#tooltip-type");
const Tooltipamount = chartTooltip.querySelector("#tooltip-amount");

const lastMonthVSElem = document.querySelector("#summary-change")
const MonthSelectorElem = document.querySelector("#MonthSelector")

const AITextElem = document.querySelector("#AItext")
const csvselectorelem = document.querySelector("#csv-selector")
const csvInput = document.querySelector("#csvInput");

datetoday = new Date()


const monthNumber = datetoday.getMonth();

MonthSelectorElem.value = monthNumber


let IncomeTransacList = []
let ExpenseTransacList = []

let LastIncomeTransacList = []
let LastExpenseTransacList = []

const MonthlyTransactions = [
    [], // January
    [], // February
    [], // March
    [], // April
    [], // May
    [], // June
    [], // July
    [], // August
    [], // September
    [], // October
    [], // November
    []  // December
];

const TopCategoryByMonth = [
    null, // January
    null, // February
    null, // March
    null, // April
    null, // May
    null, // June
    null, // July
    null, // August
    null, // September
    null, // October
    null, // November
    null  // December
];



const currentYear = new Date().getFullYear();
ThisMonthTransCountElement.innerText = Number(MonthlyTransactions[monthNumber].length)

function callNotification(Text) {
    notificationCard.innerText = String(Text)
    notificationCard.classList.add("activatedNotification")

    // console.log("called notification")
    setTimeout(() => {
        notificationCard.classList.remove("activatedNotification")

    }, 1600);
}

function GetNetBalanceThisMonth() {

    const selectedMonth = Number(MonthSelectorElem.value);

    const ThisMonthTransactions =
        MonthlyTransactions[selectedMonth] || [];

    IncomeTransacList = [];
    ExpenseTransacList = [];

    ThisMonthTransactions.forEach(transaction => {

        if (transaction.type === "Income") {
            IncomeTransacList.push(transaction);

        } else if (transaction.type === "Expense") {
            ExpenseTransacList.push(transaction);
        }

    });

    const IncomeSum = IncomeTransacList.reduce((sum, transaction) => {
        return sum + Number(transaction.amount);
    }, 0);

    const ExpenseSum = ExpenseTransacList.reduce((sum, transaction) => {
        return sum + Number(transaction.amount);
    }, 0);

    const MonthNetBalance = IncomeSum - ExpenseSum;


    if (MonthNetBalance < 0) {

        ThisMonthTotalElement.innerText =
            "-₹" + Math.abs(MonthNetBalance).toLocaleString("en-IN");

    } else if (MonthNetBalance > 0) {

        ThisMonthTotalElement.innerText =
            "+₹" + MonthNetBalance.toLocaleString("en-IN");

    } else {

        ThisMonthTotalElement.innerText = "₹0";

    }


    return {
        income: IncomeSum,
        expense: ExpenseSum,
        net: MonthNetBalance,
        incomeTransactions: IncomeTransacList,
        expenseTransactions: ExpenseTransacList
    };
}
// I wrote this bro 

// async function LastMonthTransactionsFetch() {

//     LastIncomeTransacList = []
//     LastExpenseTransacList = []

//     const OngoingMonth = MonthSelectorElem.value

//     const LastMonthTransactions = MonthlyTransactions[OngoingMonth - 1]
//     // console.log(LastMonthTransactions)

//     // console.log("value:", LastMonthTransactions);
//     // console.log("is array:", Array.isArray(LastMonthTransactions));
//     // console.log("length:", LastMonthTransactions.length);

//     console.log(OngoingMonth)

//     LastMonthTransactions.forEach(transaction => {

//         // transaction.forEach(TransacChild=>{

//         if (transaction.type === "Income") {
//             LastIncomeTransacList.push(transaction)
//         } else if (transaction.type === "Expense") {
//             LastExpenseTransacList.push(transaction)
//         }
//         // })

//         console.log("FILTERING")
//     })
//     console.log(LastExpenseTransacList, LastIncomeTransacList)

//     const LastMonthIncomeTotalValue = LastIncomeTransacList.reduce((sum, acc) => {
//         return sum + Number(acc.amount)
//         // return sum + acc
//     }, 0)

//     const LastMonthExpenseTotalValue = LastExpenseTransacList.reduce((sum, acc) => {
//         return sum + Number(acc.amount)
//     }, 0)

//     const LastMonthNetBalance = LastMonthIncomeTotalValue - LastMonthExpenseTotalValue

//     // console.log(LastMonthExpenseTotalValue, LastMonthIncomeTotalValue)

//     // console.log(LastMonthNetBalance)


//     // const IncomeSum = IncomeTransacList.reduce((sum, currentincomeAmount) => {
//     //     return sum + currentincomeAmount
//     // }, 0)
//     // const ExpenseSum = ExpenseTransacList.reduce((sum, currentExpenseAmount) => {
//     //     return sum + currentExpenseAmount
//     // }, 0)

//     const ThisMonthNetBalance = (ThisMonthTotalElement.innerText.split("₹")[1])


//     const ThisMonthVSLastMonthNetBalanceAmount = ThisMonthNetBalance - LastMonthNetBalance

//     console.log( "This month balance : ", ThisMonthNetBalance)
//     // console.log( "This month Income total : ", IncomeSum)
//     // console.log( "This month Expense total: ", ExpenseSum)

//     console.log(LastMonthNetBalance)
//     // console.log()
//     console.log(ThisMonthVSLastMonthNetBalanceAmount)

// }


function LastMonthTransactionsFetch() {

    const OngoingMonth = Number(MonthSelectorElem.value);

    const ThisMonthTransactions =
        MonthlyTransactions[OngoingMonth] || [];

    const LastMonthTransactions =
        MonthlyTransactions[OngoingMonth - 1] || [];


    // -------------------------
    // THIS MONTH NET
    // -------------------------

    let ThisMonthIncome = 0;
    let ThisMonthExpense = 0;

    ThisMonthTransactions.forEach(transaction => {

        if (transaction.type === "Income") {
            ThisMonthIncome += Number(transaction.amount);
        }

        else if (transaction.type === "Expense") {
            ThisMonthExpense += Number(transaction.amount);
        }

    });

    const ThisMonthNetBalance =
        ThisMonthIncome - ThisMonthExpense;


    // -------------------------
    // JANUARY
    // -------------------------

    if (OngoingMonth === 0) {

        LastMonthElement.innerText = "—";

        return {
            income: 0,
            expense: 0,
            net: 0,
            incomeTransactions: [],
            expenseTransactions: []
        };
    }


    // -------------------------
    // LAST MONTH
    // -------------------------

    LastIncomeTransacList = [];
    LastExpenseTransacList = [];


    LastMonthTransactions.forEach(transaction => {

        if (transaction.type === "Income") {

            LastIncomeTransacList.push(transaction);

        }

        else if (transaction.type === "Expense") {

            LastExpenseTransacList.push(transaction);

        }

    });


    const LastMonthIncomeTotalValue =
        LastIncomeTransacList.reduce((sum, transaction) => {

            return sum + Number(transaction.amount);

        }, 0);


    const LastMonthExpenseTotalValue =
        LastExpenseTransacList.reduce((sum, transaction) => {

            return sum + Number(transaction.amount);

        }, 0);


    const LastMonthNetBalance =
        LastMonthIncomeTotalValue -
        LastMonthExpenseTotalValue;


    // -------------------------
    // DIFFERENCE
    // -------------------------

    const Difference =
        ThisMonthNetBalance -
        LastMonthNetBalance;


    if (Difference < 0) {

        LastMonthElement.innerText =
            "-₹" +
            Math.abs(Difference).toLocaleString("en-IN");

    }

    else if (Difference > 0) {

        LastMonthElement.innerText =
            "+₹" +
            Difference.toLocaleString("en-IN");

    }

    else {

        LastMonthElement.innerText = "₹0";

    }


    // console.log("This Month:", ThisMonthNetBalance);
    // console.log("Last Month:", LastMonthNetBalance);
    // console.log("Difference:", Difference);


    return {
        income: LastMonthIncomeTotalValue,
        expense: LastMonthExpenseTotalValue,
        net: LastMonthNetBalance,
        incomeTransactions: LastIncomeTransacList,
        expenseTransactions: LastExpenseTransacList
    };
}


MonthSelectorElem.addEventListener("change", (e) => {
    // console.log(e.target.value);
    container.style.opacity = 0.5
    container.style.marginLeft = "30px"
    ThisMonthTransCountElement.style.opacity = 0.5
    // ThisMonthTotalElement.style.scale = 
    // LastMonthElement.style.opacity = 0.5
    //    console.log( MonthlyTransactions[e.target.value])
    setTimeout(() => {
        renderTransactions(MonthlyTransactions[e.target.value]);
        container.style.opacity = 1;
        ThisMonthTransCountElement.style.opacity = 1
        // ThisMonthTotalElement.style.scale = 1
        // LastMonthElement.style.opacity = 1
        ThisMonthTransCountElement.innerText = Number(MonthlyTransactions[e.target.value].length)
    }, 300);

    setTimeout(() => {
        container.style.marginLeft = "0px";
    }, 400);

    const ThisMonthData = GetNetBalanceThisMonth();

    LastMonthTransactionsFetch(ThisMonthData);

});

async function deleteTransaction(id) {
    console.log("Deleting ID:", id);

    const { data, error } = await database
        .from("transactions")
        .delete()
        .eq("id", id)
        .select();

    // console.log("Delete returned:", data);
    // console.log("Delete error:", error);
    // console.log("Deleting ID:", id);

    // if (error) {
    //     console.log(error.message);
    //     return;
    // }

    console.log("Transaction deleted");

    await getTransactions();
    // GetNetBalanceThisMonth()
}

function renderTransactions(transactionlist) {

    container.innerHTML = ""

    transactionlist.forEach(transaction => {

        const transactioncard = document.createElement("div")

        transactioncard.classList.add("transac-card")

        transactioncard.innerHTML = `
        <button class="deleteBtn">Delete</button>
        <span class="tran-left tran">
        <h3 class="transac-cat">${transaction.category}</h3>
        <span class="transac-amount">₹${transaction.amount}</span>
        </span>
        <span class="tran-right tran">
        <p class="transac-desc">${transaction.description}</p>
        <span class="transac-type">-  ${transaction.type}</span>
        </span>
        <span class="trantime"></span>
        `
        const trantime = transactioncard.querySelector(".trantime")

        const dateTime = new Date(transaction.created_at).toLocaleString([], {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });

        const typeoftran = transaction.type

        if (typeoftran === "Expense") {
            transactioncard.querySelector(".transac-amount").innerHTML = "- ₹" + transaction.amount
        } else if (typeoftran === "Income") {
            transactioncard.querySelector(".transac-amount").innerHTML = "+ ₹" + transaction.amount

        }

        trantime.innerHTML = `${dateTime}`

        container.appendChild(transactioncard);

        const deleteBtn = transactioncard.querySelector(".deleteBtn");

        deleteBtn.addEventListener("click", () => {
            deleteTransaction(transaction.id);
            callNotification("Transaction Deleted")
            // getTransactions()
            // console.log(IncomeTransacList)
            // console.log(ExpenseTransacList)
        });
    });

    GetLast7DaysTransactions(transactionlist)

    refreshInsight.addEventListener("click", () => {
        GetLast7DaysTransactions(transactionlist)
    })
}


addTransactionBtn.addEventListener("click", async () => {
    const amountvalue = Number(amountInput.value)
    const typevalue = typeInput.value
    const catevalue = categoryInput.value
    const descvalue = descriptionInput.value

    if (
        !amountInput.value ||
        !typevalue ||
        !catevalue
    ) {
        callNotification("Please fill all fields")
        return;
    }
    // console.log("Please fill all fields");

    const { data, error } = await database
        .from("transactions")
        .insert({
            user_id: user.id,
            amount: amountvalue,
            type: typevalue,
            category: catevalue,
            description: descvalue

        })


    // if (error) {
    //     console.log(error.message);
    //     return;
    // }

    // console.log("transaction data:", data);
    // console.log("transaction error:", error);

    getTransactions();
    callNotification("Transaction Added")


});


async function GetLast7DaysTransactions(transactions) {
    const today = new Date();

    const last7Days = []

    for (let i = 6; i >= 0; i--) {

        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);

        last7Days.push(date);
    }

    // console.log(last7Days);

    const dailyTransactions = [[], [], [], [], [], [], []];

    transactions.forEach(transac => {
        const [year, month, day] = transac.date.split("-").map(Number);
        const transacDate = new Date(year, month - 1, day);

        last7Days.forEach((day, index) => {
            if (transacDate.getTime() === day.getTime()) {
                dailyTransactions[index].push(transac)
            }

        })

        // console.log("DB date:", transac.date);
        // console.log("Parsed:", transacDate);
        // console.log("Today bucket:", last7Days[6]);

    });


    // console.log(dailyTransactions)

    let DailyExpenseList = [[], [], [], [], [], [], []]
    let DailyIncomeList = [[], [], [], [], [], [], []]

    dailyTransactions.forEach((dayTransaction, index) => {

        dayTransaction.forEach(transaction => {

            if (transaction.type === "Expense") {
                DailyExpenseList[index].push(transaction)
            }
            else if (transaction.type === "Income") {
                DailyIncomeList[index].push(transaction)
            }
        })



    })


    // console.log(DailyExpenseList)
    // console.log("Income list ", DailyIncomeList)

    let DailyNetlist = []

    for (let ind = 0; ind < 7; ind++) {
        const DailyIncomeTotal = DailyIncomeList[ind].reduce((sum, transaction) => {
            return sum + Number(transaction.amount)
        }, 0)
        const DailyExpenseTotal = DailyExpenseList[ind].reduce((sum, transaction) => {
            return sum + Number(transaction.amount)
        }, 0)

        const TodayNet = DailyIncomeTotal - DailyExpenseTotal

        DailyNetlist.push(TodayNet)
        // console.log(TodayNet)
    }

    renderWeeklyChart(DailyExpenseList, DailyIncomeList);

}



let chartbars = []

function renderWeeklyChart(DailyExpenseList, DailyIncomeList) {

    chartBars = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;



    // Theme colors
    const incomeColor = "#63C96E";
    const expenseColor = "#D65B5B";
    const gridColor = "rgba(220, 214, 195, 0.12)";
    const textColor = "#C8C0AF";
    const zeroColor = "rgba(220, 214, 195, 0.35)";

    // Chart spacing
    const topPadding = 25;
    const bottomPadding = 45;
    const sidePadding = 20;

    // Zero / baseline
    const zeroY = height - bottomPadding;

    // Usable height for bars
    const chartHeight = height - topPadding - bottomPadding;

    // Find the largest value from both income and expense
    let maxValue = 0;

    for (let i = 0; i < 7; i++) {

        const income = DailyIncomeList[i].reduce((sum, transaction) => {
            return sum + Number(transaction.amount);
        }, 0);

        const expense = DailyExpenseList[i].reduce((sum, transaction) => {
            return sum + Number(transaction.amount);
        }, 0);

        maxValue = Math.max(maxValue, income, expense);
    }

    // Dynamic scaling
    const scale = maxValue > 0
        ? chartHeight / maxValue
        : 0;

    // Divide the whole chart width into 7 equal day groups
    const groupWidth = (width - sidePadding * 2) / 7;

    // Bar dimensions
    const barWidth = Math.min(38, groupWidth * 0.25);
    const barGap = 8;

    // Baseline
    ctx.beginPath();
    ctx.moveTo(sidePadding, zeroY);
    ctx.lineTo(width - sidePadding, zeroY);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw all 7 days
    for (let i = 0; i < 7; i++) {

        // Calculate totals for this day
        const income = DailyIncomeList[i].reduce((sum, transaction) => {
            return sum + Number(transaction.amount);
        }, 0);

        const expense = DailyExpenseList[i].reduce((sum, transaction) => {
            return sum + Number(transaction.amount);
        }, 0);

        // Starting X position of this day's group
        const groupX = sidePadding + i * groupWidth;

        // X position of the two bars
        const incomeX =
            groupX + groupWidth / 2 - barWidth - barGap / 2;

        const expenseX =
            groupX + groupWidth / 2 + barGap / 2;

        // Convert money values into pixel heights
        const incomeHeight = income * scale;
        const expenseHeight = expense * scale;

        // Y positions
        const incomeY = zeroY - incomeHeight;
        const expenseY = zeroY - expenseHeight;

        // Income bar
        ctx.fillStyle = incomeColor;

        ctx.fillRect(
            incomeX,
            incomeY,
            barWidth,
            incomeHeight
        );

        // Expense bar
        ctx.fillStyle = expenseColor;

        ctx.fillRect(
            expenseX,
            expenseY,
            barWidth,
            expenseHeight
        );

        chartbars.push({
            x: incomeX,
            y: incomeY,
            width: barWidth,
            height: incomeHeight,
            type: "Income",
            amount: income,

        })

        chartbars.push({
            x: expenseX,
            y: expenseY,
            width: barWidth,
            height: expenseHeight,
            type: "Expense",
            amount: expense,

        })
    }
}

canvas.addEventListener("mousemove", (e) => {

    let hoverBar = null

    const rect = canvas.getBoundingClientRect()

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    console.log(mouseX, mouseY);

    const tooltipX = e.clientX - rect.left;
    const tooltipY = e.clientY - rect.top;

    chartTooltip.style.left = `${tooltipX + 50}px`;
    chartTooltip.style.top = `${tooltipY + 80}px`;

    chartbars.forEach(bar => {

        // yahan check karo:
        if (mouseX >= bar.x &&
            mouseX <= bar.x + bar.width &&
            mouseY >= bar.y &&
            mouseY <= bar.y + bar.height) {

            hoverBar = bar



        } else {
            if (hoverBar) {
                Tooltipamount.innerHTML = " : " + hoverBar.amount
                TooltipType.innerHTML = hoverBar.type
                TooltipDate.innerHTML = hoverBar.date
                chartTooltip.style.opacity = 1

                if (hoverBar.type === "Income") {
                    chartTooltip.style.backgroundColor = "#2e4d3a"
                } else {
                    chartTooltip.style.backgroundColor = "#4d2e2e"

                }

            } else {
                // tooltip hide
                chartTooltip.style.opacity = 0
            }
        }


    });

    console.log(hoverBar)
    console.log(chartbars)
})



function prepareInsightData(ThisMonthIncomeList, ThisMonthExpenseList, ThisMonthNet, LastMonthData) {

    // ---------- BIGGEST CURRENT-MONTH TRANSACTIONS ----------

    const biggestExpenseTransaction =
        ThisMonthExpenseList.length > 0
            ? ThisMonthExpenseList.reduce((max, transaction) => {
                return Number(transaction.amount) > Number(max.amount)
                    ? transaction
                    : max;
            })
            : null;


    const biggestIncomeTransaction =
        ThisMonthIncomeList.length > 0
            ? ThisMonthIncomeList.reduce((max, transaction) => {
                return Number(transaction.amount) > Number(max.amount)
                    ? transaction
                    : max;
            })
            : null;


    // ---------- CURRENT MONTH CATEGORY TOTALS ----------

    const ThisMonthCategoryTotals = {};

    ThisMonthExpenseList.forEach(transaction => {

        const category = transaction.category;

        if (!ThisMonthCategoryTotals[category]) {
            ThisMonthCategoryTotals[category] = 0;
        }

        ThisMonthCategoryTotals[category] += Number(transaction.amount);

    });


    // ---------- TOP EXPENSE CATEGORY ----------

    let topExpenseCategory = null;
    let topExpenseCategoryAmount = 0;

    const categoryEntries = Object.entries(ThisMonthCategoryTotals);

    if (categoryEntries.length > 0) {

        const topCategory = categoryEntries.reduce((max, current) => {
            return current[1] > max[1]
                ? current
                : max;
        });

        topExpenseCategory = topCategory[0];
        topExpenseCategoryAmount = topCategory[1];
    }


    // ---------- COMPACT DATA FOR AI ----------

    const currentIncome = ThisMonthIncomeList.reduce((sum, transaction) => {
        return sum + Number(transaction.amount);
    }, 0);

    const currentExpense = ThisMonthExpenseList.reduce((sum, transaction) => {
        return sum + Number(transaction.amount);
    }, 0);

    const insightData = {

        currentMonth: {
            income: currentIncome,
            expense: currentExpense,
            net: ThisMonthNet,

            biggestIncome: biggestIncomeTransaction
                ? {
                    amount: Number(biggestIncomeTransaction.amount),
                    category: biggestIncomeTransaction.category,
                    description: biggestIncomeTransaction.description
                }
                : null,

            biggestExpense: biggestExpenseTransaction
                ? {
                    amount: Number(biggestExpenseTransaction.amount),
                    category: biggestExpenseTransaction.category,
                    description: biggestExpenseTransaction.description
                }
                : null,

            topExpenseCategory,
            topExpenseCategoryAmount
        },

        lastMonth: {
            income: LastMonthData.income,
            expense: LastMonthData.expense,
            net: LastMonthData.net
        },

        comparison: {
            incomeDifference: currentIncome - LastMonthData.income,
            expenseDifference: currentExpense - LastMonthData.expense,
            netDifference: ThisMonthNet - LastMonthData.net
        }
    };


    const Dataverifiedprompt = `
You are Ledger's financial insights generator.

Analyze the financial data below and provide ONE useful insight for the user.

Rules:
- Use only the provided data.
- Do not invent transactions, amounts, or patterns.
- Do not give investment or financial advice.
- Give suggestions based on the data to reduce expenses.
- Focus on the most meaningful spending or income pattern.
- Compare with last month when useful.
- Mention the top expense category when relevant.
- Keep the response to 1-2 sentences.
- Return only the insight text.
- Do not use headings, bullet points, dash, or quotation marks.

Financial data:
${JSON.stringify(insightData)}
`;

    return Dataverifiedprompt;

}

// async function CallAItoGetInsights(Dataverifiedprompt) {

//     const response = await fetch("https://api.groq.com/openai/v1/responses", {
//         method: "POST",

//         headers: {
//             "Content-Type": "application/json",

//             "Authorization": `Bearer ${APIKEY}`
//         },

//         body: JSON.stringify({
//             model: "openai/gpt-oss-20b",
//             input: Dataverifiedprompt,
//             max_output_tokens: 200
//         })
//     });

//     if (!response.ok) {
//         const errorText = await response.text();
//         console.log("AI API Error:", errorText);
//         return;
//     }

//     const result = await response.json();

//     console.log(result);
// }

// CallAItoGetInsights(prepareInsightData())

async function GetTransactionsByCategory() {
    const ThisMonthTransactionsListForCategory = MonthlyTransactions[monthNumber]

    ThisMonthTransactionsListForCategory.filter()
}

async function testGrok(prompt) {

    const response = await fetch("/api/insight", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            prompt: prompt
        })
    });

    const result = await response.json();

    if (!response.ok) {
        console.log("AI Error:", result.error);
        return;
    }

    return result.answer;
}

async function getTransactions(params) {
    const { data, error } = await database
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });





    if (error) {
        console.log(error.message)
        return
    }

    IncomeTransacList = [];
    ExpenseTransacList = [];

    MonthlyTransactions.forEach(month => {
        month.length = 0;
    });

    data.forEach(transaction => {
        if (transaction.type === "Expense") {
            ExpenseTransacList.push(transaction.amount);
        }
        else if (transaction.type === "Income") {
            IncomeTransacList.push(transaction.amount);
        }

        const [year, month, day] = transaction.date.split("-").map(Number)
        // console.log(year , month , day)

        if (year === currentYear) {
            MonthlyTransactions[month - 1].push(transaction)
        }

    });

    renderTransactions(MonthlyTransactions[monthNumber]);
    GetNetBalanceThisMonth();

    const selectedMonth = Number(MonthSelectorElem.value);

    renderTransactions(MonthlyTransactions[selectedMonth])

    ThisMonthTransCountElement.innerText =
        MonthlyTransactions[selectedMonth].length;

    GetNetBalanceThisMonth();
    LastMonthTransactionsFetch();
    ThisMonthTransCountElement.innerText = MonthlyTransactions[selectedMonth].length

    // console.log(MonthlyTransactions)

    const ThisMonthData = GetNetBalanceThisMonth();
    const LastMonthData = LastMonthTransactionsFetch();

    LastMonthTransactionsFetch(ThisMonthData);

    const prompt = prepareInsightData(
        ThisMonthData.incomeTransactions,
        ThisMonthData.expenseTransactions,
        ThisMonthData.net,
        LastMonthData);

    // await CallAItoGetInsights(prompt);

    // await testGrok(prompt)

    //    AITextElem.innerText = await testGrok(prompt)

}

getTransactions()

csvselectorelem.addEventListener("click", () => {
    csvInput.click();
})

csvInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {

        const csvText = event.target.result;

        console.log(csvText);

        const rows = csvText.split(/\r?\n/);
    
        const headers = rows[0].split(",");
    };

    reader.readAsText(file);

});

// CallAItoGetInsights("Give me one short test insight.");