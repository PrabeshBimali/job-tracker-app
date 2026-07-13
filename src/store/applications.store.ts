import {type ApplicationType} from "../components/form/AddApplicationForm";

class ApplicationsStore {
  private state: Array<ApplicationType>;
  private subscribers: Array<(state: Array<ApplicationType>) => void>;

  constructor() {
    this.state = [];
    this.subscribers = [];
  }

  getSnapshot = (): Array<ApplicationType> => {
    return this.state;
  }

  subscribe = (callback: (state: Array<ApplicationType>) => void) => {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers = () => {
    this.subscribers.forEach(callback => callback(this.state));
  }

  setApplications = (applications: Array<ApplicationType>) => {
    this.state = applications;
    this.notifySubscribers();
  }

  addNewApplication = (application: ApplicationType) => {
    this.state = [...this.state, application];
    this.notifySubscribers();
  }
}

const applicationsStore = new ApplicationsStore();

export default applicationsStore;