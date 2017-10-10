/// <reference path="../node_modules/@types/jest/index.d.ts" />

import { WorkItemService } from "../src/modules/WorkItemService";

describe("Work Item Service TestFixture", () => {
    describe("buildWiql", () => {
        const service = new WorkItemService();
        it("Simple No Criteria Clause", (done) => {
            const wiql = service.buildWiql("", undefined);

            let expectedQuery = "SELECT [System.Id], [System.WorkItemType], [System.AssignedTo], [System.Title], [System.State] " +
                "FROM WorkItems " +
                "ORDER BY [System.ChangedDate] DESC ASOF '" + new Date().toDateString() + "'";

            expect(wiql.query).toBe(expectedQuery);
            done();
        });

        it("Set AsOf Date Clause", (done) => {
            let asOfDate = new Date(2015, 10, 10);
            let expectedQuery = "SELECT [System.Id], [System.WorkItemType], [System.AssignedTo], [System.Title], [System.State] " +
                "FROM WorkItems " +
                "ORDER BY [System.ChangedDate] DESC ASOF '" + asOfDate.toDateString() + "'";

            const wiql = service.buildWiql("", asOfDate);

            expect(wiql.query).toBe(expectedQuery);
            done();
        });

        it("Set Title Criteria and not Date", (done) => {
            let expectedQuery = "SELECT [System.Id], [System.WorkItemType], [System.AssignedTo], [System.Title], [System.State] " +
                "FROM WorkItems " +
                "WHERE [System.Title] contains 'test' " +
                "ORDER BY [System.ChangedDate] DESC ASOF '" + new Date().toDateString() + "'";

            const wiql = service.buildWiql("test", undefined);

            expect(wiql.query).toBe(expectedQuery);
            done();
        });

        it("Set Title and Date Clause", (done) => {
            let asOfDate = new Date(2015, 10, 10);
            let expectedQuery = "SELECT [System.Id], [System.WorkItemType], [System.AssignedTo], [System.Title], [System.State] " +
                "FROM WorkItems " +
                "WHERE [System.Title] contains 'test' " +
                "ORDER BY [System.ChangedDate] DESC ASOF '" + asOfDate.toDateString() + "'";

            const wiql = service.buildWiql("test", asOfDate);

            expect(wiql.query).toBe(expectedQuery);
            done();
        });
    });
});