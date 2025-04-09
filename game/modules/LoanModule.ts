// Module (CLASS): InversionModule
// it will recopile all the inversions active and indicates with events if any inversion has completed or changed state by period or day
import EventsCenterManager from "../services/EventsCenter";


export type LoanJsonState = {
    loans: {
        id: string;
        periodLeft: number;
        holdAmout: number;
        percent: number;
    }[],
    isActive: boolean;
    isPaused: boolean;
    totalInvested: number;
    //gainLossLastPeriod: number;
}

export type InversionAndLoanType = {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    periodCycle: number;
    periodLeft: number;
    cyclesCompleted: number;
    startAmount: number;
    paid?: number;
    startPercentage?: number;
    startType?: 'percentage' | 'amount';
    interestLoan?: number;
    lastData?: 'up' | 'down' | 'same';
    holdAmout: number;
    state: "active" | "completed" | "canceled" | "inactive" | "disabled";
    percent: number;
    inversionType: "stock" | "fixed";
}

class LoanModule {
    isActive: boolean = true;
    isPaused: boolean = false;
    loans: InversionAndLoanType[] = [];
    totalDebt: number = 0;
    eventCenter = EventsCenterManager.getInstance();
    possibleLoans: InversionAndLoanType[] = [
        {
            id: '0',
            name: 'Prestamo para ocio',
            description: 'Prestamo para la compra de una casa',
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 4,
            cyclesCompleted: 0,
            periodLeft: 4,
            startAmount: 100,
            startType: 'amount',
            holdAmout: 0,
            interestLoan: 15,
            state: "inactive",
            percent: 10,
            inversionType: "fixed",
        },
        {
            id: '1',
            name: 'Prestamo hipotecario 1',
            description: 'Prestamo para la compra de una casa',
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 4,
            cyclesCompleted: 0,
            periodLeft: 4,
            startAmount: 500,
            startType: 'amount',
            holdAmout: 0,
            interestLoan: 15,
            state: "inactive",
            percent: 10,
            inversionType: "fixed",
        },
        {
            id: '2',
            name: 'Prestamo hipotecario 2',
            description: 'Prestamo para la compra de una casa',
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 4,
            cyclesCompleted: 0,
            periodLeft: 4,
            startAmount: 300,
            startType: 'amount',
            holdAmout: 0,
            interestLoan: 10,
            state: "inactive",
            percent: 5,
            inversionType: "fixed",
        },
        {
            id: '3',
            name: 'Prestamo negocio',
            description: 'Prestamo para la compra de una casa',
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 4,
            cyclesCompleted: 0,
            periodLeft: 4,
            startAmount: 1000,
            startType: 'amount',
            holdAmout: 0,
            interestLoan: 10,
            state: "inactive",
            percent: 5,
            inversionType: "fixed",
        },
        {
            id: '4',
            name: 'Prestamo para auto',
            description: 'Prestamo para la compra de una casa',
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 4,
            cyclesCompleted: 0,
            periodLeft: 4,
            startAmount: 250,
            startType: 'amount',
            holdAmout: 0,
            interestLoan: 10,
            state: "inactive",
            percent: 5,
            inversionType: "fixed",
        },
    ]

    constructor() {

    }


    sumLoans() {
        let newTotal = 0;
        [...this.loans].map(loan => {
            const interestLoan = loan.interestLoan ? loan.interestLoan : 0;
            newTotal += (loan.startAmount*(100 + interestLoan)/100 - loan.holdAmout)
        });
        this.totalDebt = newTotal;
    }

    handleLoanInGlobalData(type: "add" | "remove", loan: InversionAndLoanType) {
        this.sumLoans();
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.HANDLE_LOAN, { type, loan });
    }

    takeLoan(loan: InversionAndLoanType) {
        this.loans.push({ ...loan, state: "active" });
        this.handleLoanInGlobalData("add", loan);
    }

    payLoan(id: string) {
        const loan = this.loans.find(loan => loan.id === id)
        this.loans = this.loans.filter(loan => loan.id !== id);
        this.possibleLoans = this.possibleLoans.filter(loan => loan.id !== id);
        if (loan) {
            this.loans = this.loans.filter(_loan => _loan.id !== loan.id);
            this.possibleLoans.push({ ...loan, state: "disabled" });
            this.possibleLoans = [...this.possibleLoans].map((l) => {
                if (l.id !== loan.id) l.state = "inactive";
                return l;
            });
            this.handleLoanInGlobalData("remove", loan);
        }
    }

    updateLoan(id: string, _: Partial<InversionAndLoanType>) {
        this.loans = this.loans.map(loan => {
            if (loan.id === id) {
                return { ...loan, ..._ };
            }
            return loan;
        });
        this.sumLoans();
    }

    getLoan(id: string) {
        return this.loans.find(loan => loan.id === id);

    }

    getLoans() {
        return this.loans;
    }

    getLoansByState(state: InversionAndLoanType["state"]) {
        return this.loans.filter(inversion => inversion.state === state);
    }

    getLoansByDate(date: Date) {
        return this.loans.filter(loan => loan.startDate <= date && loan.endDate >= date);
    }

    getLoansByDateRange(startDate: Date, endDate: Date) {
        return this.loans.filter(loan => loan.startDate <= endDate && loan.endDate >= startDate);
    }

    getOnlyRepeatedLoans(a: InversionAndLoanType[], b: InversionAndLoanType[]) {
        return a.filter(loan => b.some(loan2 => loan.id === loan2.id));
    }

    computeLoansPayment(loan: InversionAndLoanType, cyclesPassed: number) {
        loan.periodLeft -= cyclesPassed;
        if (loan.periodLeft <= 0) {
            loan.periodLeft = loan.periodCycle
            loan.cyclesCompleted++
            const toPay = loan.startAmount * loan.percent / 100;
            loan.holdAmout += toPay;
            const leftToPay = loan.startAmount - loan.holdAmout;
            this.sumLoans();
            if (leftToPay <= 0) {
                this.loans = this.loans.filter(_loan => _loan.id !== loan.id);
                this.possibleLoans = this.possibleLoans.filter(_loan => _loan.id !== loan.id);
                this.possibleLoans.push({ ...loan, state: "disabled" });
                this.possibleLoans = [...this.possibleLoans].map((l) => {
                    if (l.id !== loan.id) l.state = "inactive";
                    return l;
                });
            }
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.PAY_LOAN, { amount: toPay, loan: loan });

        };
        this.updateLoan(loan.id, loan);
    }

    computePeriods(cyclesPassed: number) { // case stock market
        this.loans.map(loan => {
            switch (loan.inversionType) {
                case "fixed":
                    this.computeLoansPayment(loan, cyclesPassed);
                    break;
                default: break;
            }
        });
    }

    dayChanged(cyclesPassed: number) {
        if (!this.isActive || this.isPaused) return
        this.computePeriods(cyclesPassed);
    }

    applyJsonState(state: LoanJsonState) {
        this.isActive = state.isActive;
        this.isPaused = state.isPaused;
        this.totalDebt = state.totalInvested;
        //this.gainLossLastPeriod = state.gainLossLastPeriod;
        this.loans = state.loans.map(l => {
            const loan = this.possibleLoans.find(_l => _l.id === l.id);
            if (!loan) return null;
            return {
                ...loan,
                holdAmout: l.holdAmout,
                periodLeft: l.periodLeft,
                percent: l.percent,
                state: l.periodLeft > 0 ? "active" : "completed"
            }
        }).filter(l => l !== null) as InversionAndLoanType[];
    }

    getJsonState() {
        const newLoanOptions = [...this.loans].map(l => ({
            id: l.id,
            periodLeft: l.periodLeft,
            holdAmout: l.holdAmout,
            percent: l.percent,
        }));
        return {
            isActive: this.isActive,
            isPaused: this.isPaused,
            loans: newLoanOptions,
            totalInvested: this.totalDebt,
            //gainLossLastPeriod: this.gainLossLastPeriod
        } as LoanJsonState;
    }

}

export default LoanModule;