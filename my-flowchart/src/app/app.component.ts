import { Component, OnInit } from '@angular/core';
import { jsPlumb, jsPlumbInstance, AnchorSpec, OverlayId, Connection } from 'jsplumb';
import { FunctionFlow } from './component/functionChart';
import { NzModalService } from 'ng-zorro-antd';
import { SettingModalComponent } from './setting-modal/setting-modal.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'my-flowchart';
  instance: jsPlumbInstance;
  pointLocation: AnchorSpec[] = ['Bottom', 'Left', 'Right', 'Top'];

  endPointParams = {
    isSource: true,
    isTarget: true,
    maxConnections: 1,
    reattachConnections: true,
    type: 'dot',
    scope: '',
    parameters: { radius: 5},
    paintStyle: {  fill: '#ccc' },
    connectorStyle: {stroke: 'black', strokeWidth: 4 },
    connectorOverlays: ['Arrow' as OverlayId],
  };

  functionList = [
    'calculate data', 'function1', 'function2', 'function3', 'function4', 'function5', 'function6', 'function7', 'function8'
  ];

  functionInstanceList = { };

  dropItems = [];

  flowList: FunctionFlow[] = [];

  constructor(
    private modalSrv: NzModalService
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.instance = jsPlumb.getInstance(
        {
          Container: 'diagramContainer',
          DragOptions: { cursor: 'pointer', zIndex: 2000, containment: 'diagramContainer' },
          HoverPaintStyle: { stroke: '#7073EB' },
          EndpointHoverStyle: { fill: '#7073EB', strokeWidth: 10 },
          EndpointStyle: { fill: '#567567', strokeWidth: 2 },
          PaintStyle: { fill: '#567567', strokeWidth: 2}
        }
      );
      this.instance.bind('connection', (res) => {
        const source = this.findFlow(res.sourceId);
        const target = this.findFlow(res.targetId);
        source.setNext(target);
      });
      this.instance.bind('dblclick', (conn) => {
          this.instance.deleteConnection(conn);
          const source = this.findFlow((conn as any).sourceId);
          const target = this.findFlow((conn as any).targetId);
          source.deleteNext(target);
        }
      );
    }, 0);
  }

  deleteFlow(id: string) {
    const index = this.dropItems.findIndex(item => item.data === id);
    this.dropItems.splice(index, 1);
    this.instance.getEndpoints(id).forEach(t => {
      this.instance.deleteEndpoint(t);
    });
    this.deleteRelatedConnection(id);
  }

  creatSettigModal(item) {
    console.log(item, this.flowList)
    const modal = this.modalSrv.create({
      nzTitle: '参数设置',
      nzContent: SettingModalComponent,
      nzComponentParams: {
        type: 1,
      },
      nzFooter: [
        {
          label: '确认',
          type: 'primary',
          onClick: (componentInstance) => {
            if (componentInstance) {
              console.log(item)
              const res = componentInstance.submit();
              this.findFlow(item.data).setParams(res);
              modal.destroy();
            } else {
              console.log('wrong');
            }
          }
        },
        {
          label: '取消',
          onClick: () => modal.destroy()
        }
      ]
    });
  }

  deleteRelatedConnection(id: string) {
    this.flowList.map((item, index) => {
      if (item.name === id) {
        this.flowList.splice(index, 1);
      } else {
        item.next.map((t, i) => {
          if (t.name === id) {
            item.next.splice(i, 1);
          }
        });
      }
    });
  }

  findFlow(name: string) {
    const target = this.flowList.find(t => t.name === name);
    return target;
  }

  setFlowChart(id: string) {
    this.instance.draggable(id, {
      containment: 'diagramContainer',
      cursor: 'pointer',
      drag: (param) => {
      }
    });
    this.pointLocation.forEach(item => {
      const point = this.instance.addEndpoint(id, {...this.endPointParams, anchor: item, id}) as any;
      point.endpoint.radius = 5;
    });
    this.instance.repaint(id);
  }

  onDrop(event: any) {
    if (this.functionInstanceList[event.data]) {
      this.functionInstanceList[event.data] ++;
    } else {
      this.functionInstanceList[event.data] = 1;
    }
    event.data = event.data + '-' + this.functionInstanceList[event.data];
    this.dropItems.push(event);
    this.flowList.push(new FunctionFlow(event.data));
    setTimeout(() => {
      this.setFlowChart(event.data);
    }, 0);
  }

  getDataFlow() {
    const dataFlow = this.findFlow('calculate data-1');
    if (dataFlow && dataFlow.next.length > 0) {
      console.log(dataFlow);
      return dataFlow;
    } else {
      alert('数据要从data出发');
    }
  }
}
