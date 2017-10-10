import * as WorkClient from "TFS/WorkItemTracking/RestClient";
import { WorkItem, Wiql } from "TFS/WorkItemTracking/Contracts";

/**
 * Interface for work item search results
 */
export interface IWorkItemSearchResult {
    workItems: WorkItem[];
    error?: string;
}

/**
 * Service class to query work items
 */
export class WorkItemService {

    /**
     * Execute a query to retrieve a set of work items
     */
    public searchWorkItems(titleFilter: string, asOfDate: Date): IPromise<IWorkItemSearchResult> {
        let client = WorkClient.getClient();
        let query = this.buildWiql(titleFilter, asOfDate);
        let context = VSS.getWebContext();

        // execute the query to retrieve the work item id's
        return client.queryByWiql(query, context.project.id, undefined, undefined, 100).then(
            queryResult => {
                // use the work item id's to resolve the work items
                if (queryResult.workItems.length > 0) {
                    return client.getWorkItems(
                        queryResult.workItems.map(workItem => workItem.id),
                        queryResult.columns.map(wiRef => wiRef.referenceName)
                    ).then(
                        workItems => {
                            return { workItems: workItems } as IWorkItemSearchResult;
                        },
                        err => {
                            return { workItems: [], error: err.message } as IWorkItemSearchResult;
                        }
                        );
                } else {
                    return { workItems: [] } as IWorkItemSearchResult;
                }
            },
            err => {
                return { error: err.message } as IWorkItemSearchResult;
            }
        ) as IPromise<IWorkItemSearchResult>;
    }

    /**
     * Build a default wiql query statement
     */
    public buildWiql(title: string = "", asOfDate: Date | undefined) {
        let checkDate: Date = new Date();
        if (asOfDate !== undefined) {
            checkDate = asOfDate;
        }
        let fields = "SELECT [System.Id], [System.WorkItemType], [System.AssignedTo], [System.Title], [System.State] " +
            "FROM WorkItems ";
        let order = "ORDER BY [System.ChangedDate] DESC ";

        let whereClause = "";
        let asofDateClause = "ASOF '" + checkDate.toDateString() + "'";

        if (title !== "") {
            whereClause = "WHERE [System.Title] contains '" + title + "' ";
        }

        return {
            query: fields + whereClause + order + asofDateClause
        };
    }
}