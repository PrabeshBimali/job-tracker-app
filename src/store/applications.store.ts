import {type ApplicationType} from "../components/form/ApplicationForm";

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

  deleteApplication = (id: number) => {
    this.state = this.state.filter(app => app.id !== id);
    this.notifySubscribers();
  }

  toggleFavorite = (id: number) => {
    this.state = this.state.map((app) =>
      app.id === id ? { ...app, favorite: !app.favorite } : app
    );
    this.notifySubscribers();
  }
  
  toggleArchive = (id: number) => {
    this.state = this.state.map((app) =>
      app.id === id ? { ...app, archived: !app.archived } : app
    );
    this.notifySubscribers();
  }

  updateApplication = (application: ApplicationType) => {
    this.state = this.state.map((app) =>
      app.id === application.id ? application : app
    );
    this.notifySubscribers();
  }
}

const applicationsStore = new ApplicationsStore();

export default applicationsStore;