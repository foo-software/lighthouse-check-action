import {UserFlow as UserFlow_} from '../lighthouse-core/fraggle-rock/user-flow';

declare module UserFlow {
  export interface FlowArtifacts {
    gatherSteps: GatherStep[];
    name?: string;
  }

  export interface GatherStep {
    artifacts: LH.Artifacts;
    name: string;
    config?: LH.Config.Json;
    configContext?: LH.Config.FRContext;
  }
}

type UserFlow = typeof UserFlow_;

export default UserFlow;
