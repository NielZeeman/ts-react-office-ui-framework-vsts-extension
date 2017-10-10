import * as React from "react";

import { Spinner, SpinnerType } from "office-ui-fabric-react/lib/Spinner";
import { DetailsList, DetailsListLayoutMode } from "office-ui-fabric-react/lib/DetailsList";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox";
import { DatePicker } from "office-ui-fabric-react/lib/DatePicker";
import { CommandBarButton, IButtonProps } from "office-ui-fabric-react/lib/Button";

import { WorkItem } from "TFS/WorkItemTracking/Contracts";

import { WorkItemService } from "../modules/WorkItemService";

export interface IWorkItemFilter {
    title: string;
    asOfDate: Date;
}
export interface IWorkItemListState {
    isLoading: boolean;
    workItems: WorkItem[];
    error: string;
    filter: IWorkItemFilter;
}

export class WorkItemList extends React.Component<{}, IWorkItemListState> {

    constructor(props?) {
        super(props);

        // set initial state
        this.state = { isLoading: false, workItems: [], error: "", filter: { title: "", asOfDate: new Date() } };
    }

    public render() {
        let filterSection: JSX.Element = this.renderFilter();
        // If it is loading, then just show the spinner
        if (this.state.isLoading) {
            return <div className="hub-content">
                {filterSection}
                <div className="loader">
                    <Spinner type={SpinnerType.large} />
                </div>
            </div>;

        } else {
            // Loading is done, display the results idf any
            if (this.state.error) {
                return (
                    <MessageBar>{this.state.error}</MessageBar>
                );
            } else {

                let items = this.state.workItems.map(wi => wi.fields);
                let resultDetail: JSX.Element = <div />;
                if (items.length > 0) {
                    resultDetail = <DetailsList
                        items={items}
                        layoutMode={DetailsListLayoutMode.fixedColumns}
                        columns={_columns}
                    />;
                }
                return (
                    <div>
                        {filterSection}
                        {resultDetail}
                    </div>
                );
            }
        }
    }

    public renderFilter(): JSX.Element {
        let filterCriteria = this.state.filter;
        let filter = <div className="filter-section">
            <SearchBox
                onChanged={(newValue) => this.onSearchChange(newValue)}
                value={filterCriteria.title}
                width={200}
                placeholder="Title Search"
                className="filters"
            />
            <DatePicker
                placeholder={"Select Date"}
                onSelectDate={(date) => this.onDateChange(date)}
                className="filters"
                value={filterCriteria.asOfDate}
            />
            <CommandBarButton
                iconProps={{ iconName: "Add" }}
                text="Search"
                onClick={() => this.search()}
                className="actions"
            />
        </div>;
        return filter;
    }

    private onSearchChange(newValue: string): void {
        this.state.filter.title = newValue;
        this.setState(this.state);
    }

    private onDateChange(newValue: Date | null | undefined): void {
        if (newValue !== null && newValue !== undefined) {
            this.state.filter.asOfDate = newValue;
            this.setState(this.state);
        }
    }

    private search() {
        this.setState({ isLoading: true });
        let workItemService = new WorkItemService();
        let filter = this.state.filter;
        workItemService.searchWorkItems(filter.title, filter.asOfDate).then(workItemSearchResult => {
            if (workItemSearchResult.error) {
                this.setState({ error: workItemSearchResult.error, isLoading: false });
            } else {
                this.setState({ workItems: workItemSearchResult.workItems, isLoading: false, error: "" });
            }
        });
    }

}

// Setup the column definitions
let _columns = [
    {
        key: "System.WorkItemType",
        name: "Type",
        fieldName: "System.WorkItemType",
        minWidth: 200,
        isResizable: true
    },
    {
        key: "System.Title",
        name: "Title",
        fieldName: "System.Title",
        minWidth: 300,
        isResizable: true
    },
    {
        key: "status",
        name: "Status",
        fieldName: "System.State",
        minWidth: 100,
        isResizable: true
    }
];