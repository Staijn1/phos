import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../services/electron/electron.service';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';

declare interface DataRow {
    id?: number;
    comName?: string;
    manufacturer?: string;
    vendorId?: string;
    productId?: string;
}

declare interface TableData {
    headerRow: string[];
    dataRows: DataRow[];
}

@Component({
    selector: 'app-serialportron',
    templateUrl: 'serialportron.component.html',
})
export class SerialportronComponent implements OnInit {

    public tableData: TableData;
    public port: any;
    public selectedPortId: string;
    public portOpts = {baudRate: 115200, autoOpen: false};

    constructor(
        public serialService: SerialConnectionService,
    ) {
    }

    ngOnInit() {
        this.tableData = {
            headerRow: ['#', 'COM name', 'Manuf.', 'Vendor ID', 'Product ID'],
            dataRows: [],
        };
    }

    scan() {
        this.serialService.scan();
    }

    getPort($event) {
        this.serialService.getPort($event);
    }

    openPort() {
        this.serialService.openPort();
    }

    closePort() {
        this.serialService.closePort();
    }
}
