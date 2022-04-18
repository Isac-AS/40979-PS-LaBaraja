import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { MessagePopupPair} from "../../models/interfaces";

@Component({
  selector: 'app-info-message-popup',
  templateUrl: './info-message-popup.component.html',
  styleUrls: ['./info-message-popup.component.css']
})
export class InfoMessagePopupComponent implements OnInit {

  message : string;
  status: boolean;

  constructor(public dialogRef: MatDialogRef<InfoMessagePopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data:MessagePopupPair) {
    this.message = data.message;
    this.status = data.status;
  }

  ngOnInit(): void {
  }

}
