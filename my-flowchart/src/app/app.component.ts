import { Component, OnInit } from '@angular/core';
import { jsPlumb, jsPlumbInstance, AnchorSpec, OverlayId, Connection } from 'jsplumb';

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
    paintStyle: {  fill: 'black' },
    connectorStyle: {stroke: 'black', strokeWidth: 4 },
    connectorOverlays: ['Arrow' as OverlayId],
  };

  functionList = [
    'function1', 'function2', 'function3', 'function4', 'function5', 'function6', 'function7', 'function8'
  ];

  functionInstanceList = { };

  dropItems = [];

  constructor() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.instance = jsPlumb.getInstance(
        {
          DragOptions: { cursor: 'pointer', zIndex: 2000 },
          HoverPaintStyle: { stroke: '#7073EB' },
          EndpointHoverStyle: { fill: '#7073EB', strokeWidth: 10 },
          EndpointStyle: { fill: '#567567', strokeWidth: 2 },
          PaintStyle: { fill: '#567567', strokeWidth: 2}
        }
      );
      this.instance.setContainer('diagramContainer');
      this.instance.bind('dblclick', (conn) => {
          this.instance.deleteConnection(conn);
        }
      );
    }, 0);
  }

  setFlowChart(id: string) {
    this.instance.draggable(id, {
      containment: 'diagramContainer',
      drag: res => {
        res.el.style.left = parseInt(res.el.style.left, 10) - 50 + 'px';
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
    setTimeout(() => {
      this.setFlowChart(event.data);
    }, 0);
  }
}
