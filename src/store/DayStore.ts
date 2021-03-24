import { observable, computed } from 'mobx';

interface DayRefStoreInterface {
  ref: any;
  actualDate: Date;
}

interface DayStoreInterface {
  xPosition: number;
  yPosition: number;
  actualDate: Date;
}

class DayStore {
  @observable allDays: DayStoreInterface[] = [];
  @observable allDaysRef: DayRefStoreInterface[] = [];

  @observable previousX: number | undefined;
  @observable previousY: number | undefined;

  @observable twoDimensionalMap = {} as {
    [key: number]: { [key: number]: Date };
  };

  @observable currentDate: undefined | number;

  @observable twoDimensionalRealMap = new Map<number, Map<number, Date>>();

  addDayRef(ref: DayRefStoreInterface) {
    this.allDaysRef.push(ref);
  }

  addDay(day: DayStoreInterface) {
    this.allDays.push(day);
  }

  emptyDays() {
    this.allDays = [];
  }

  @computed get compotedAllDaysRef() {
    return this.allDaysRef;
  }
}

export const sharedDayStore = new DayStore();
