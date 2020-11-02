export class ControlPropertyData {
  data: {
    [controlName: string]: {
      [propName: string]: {};
    };
  };
  constructor () {
    this.data = {
      UseForm: {
        properties: {
          BackColor: '#ffffff',
          BorderColor: '#ffffff',
          BorderStyle: 1,
          Caption: 'UserForm1',
          Cycle: 1,
          DrawBuffer: 32000,
          Enabled: true,
          Font: {
            FontName: 'Arial',
            FontSize: 10,
            FontBold: false,
            FontItalic: true,
            FontUnderline: true,
            FontStrikethrough: true,
            FontStyle: 'Arial Narrow Italic'
          },
          ForeColor: '#ffffff',
          Height: 350,
          HelpContextID: 0,
          KeepScrollBarsVisible: 3,
          Left: 0,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'UserForm1',
          ID: 'ID_USERFORM1',
          Picture: '',
          PictureAlignment: 2,
          PictureSizeMode: 0,
          PictureTiling: false,
          RightToLeft: false,
          ScrollBars: 0,
          ScrollHeight: 0,
          ScrollLeft: 0,
          ScrollTop: 0,
          ScrollWidth: 0,
          ShowModal: true,
          SpecilalEffect: 3,
          StartUpPosition: 1,
          Tag: '',
          Top: 0,
          Width: 700,
          WhatsThisButton: false,
          WhatsThisHelp: false,
          Zoom: 100
        },
        controls: ['ID_Label1', 'ID_Label2'],
        extraDatas: {
          display: 'block',
          Active: true
        },
        type: 'Userform'
      },
      Label: {
        properties: {
          Accelerator: '',
          AutoSize: false,
          BackColor: '#ffffff',
          BackStyle: 1,
          BorderColor: '#ffffff',
          BorderStyle: 1,
          Caption: 'Label1',
          ControlTipText: 'helptext',
          Enabled: true,
          Font: {
            FontName: 'Arial',
            FontSize: 10,
            FontBold: false,
            FontItalic: true,
            FontUnderline: true,
            FontStrikethrough: true,
            FontStyle: 'Arial Narrow Italic'
          },
          ForeColor: '#000000',
          Height: 18,
          HelpContextID: 0,
          Left: 0,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'Label1',
          ID: 'ID_Label1',
          Picture: '',
          PicturePosition: 7,
          SpecialEffect: 0,
          TabIndex: 0,
          TabStop: true,
          Tag: '',
          TextAlign: 1,
          Top: 0,
          Visible: true,
          Width: 72,
          WordWrap: true,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          Active: false,
          BoxShadow: 'none',
          WhiteSpace: 'normal',
          WordBreak: 'normal',
          backgroundPositionX: '',
          backgroundPositionY: '',
          autoSizeWidth: '',
          autoSizeHeight: '',
          acceleratorValue: ''
        },
        type: 'Label'
      },
      CommandButton: {
        properties: {
          Accelerator: '',
          AutoSize: false,
          BackColor: 'red',
          BackStyle: 1,
          Caption: 'CommandButton1',
          Cancel: false,
          ControlTipText: 'helptext',
          Enabled: true,
          Default: false,
          Font: {
            FontName: 'Arial',
            FontSize: 10,
            FontBold: false,
            FontItalic: true,
            FontUnderline: true,
            FontStrikethrough: true,
            FontStyle: 'Arial Narrow Italic'
          },
          ForeColor: '#000000',
          Height: 18,
          HelpContextID: 0,
          Left: 0,
          Locked: false,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'CommandButton1',
          ID: 'ID_CommandButton1',
          Picture: '',
          PicturePosition: 7,
          TabIndex: 0,
          TabStop: true,
          Tag: '',
          TakeFocusOnClick: true,
          Top: 50,
          Visible: true,
          Width: 72,
          WordWrap: true
        },
        controls: [],
        extraDatas: {
        },
        type: 'CommandButton'
      },
      CheckBox: {
        properties: {
          Accelerator: '',
          Alignment: 1,
          AutoSize: false,
          BackColor: '#ffffff',
          BackStyle: 1,
          Caption: 'CheckBox1',
          ControlTipText: 'helptext',
          ControlSource: 'a1',
          Enabled: true,
          Font: {
            FontName: 'Arial',
            FontSize: 10,
            FontBold: false,
            FontItalic: true,
            FontUnderline: true,
            FontStrikethrough: true,
            FontStyle: 'Arial Narrow Italic'
          },
          ForeColor: '#000000',
          GroupName: '',
          Height: 18,
          HelpContextID: 0,
          Left: 0,
          Locked: false,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'CheckBox1',
          ID: 'ID_CheckBox1',
          Picture: '',
          PicturePosition: 7,
          SpecialEffect: 0,
          TabIndex: 0,
          TabStop: true,
          Tag: '',
          TextAlign: 1,
          Top: 0,
          TripleState: false,
          Value: 'False',
          Visible: true,
          Width: 72,
          WordWrap: true
        },
        controls: [],
        extraDatas: {
          ControlSourceValue: 'true'
        },
        type: 'CheckBox'
      },
      ComboBox: {
        properties:
        {
          name: 'ComboBox1',
          autoSize: false,
          autoTab: false,
          autoWordSelect: true,
          boundColumn: 1,
          columnCount: 1,
          columnHeads: false,
          columnWidths: '',
          controlSource: '',
          controlTipText: '',
          dragBehavior: '0 - fmDragBehaviotDisabled',
          dropButtonStyle: '1 - fmDropButtonStyleArrow ',
          enabled: true,
          enterFieldBehavior: '0 - fmEnterFiledBehaviorSelectAll',
          helpContextId: 0,
          hideSelection: true,
          imeMode: '0 - fmIMEModeNOControl',
          listRows: 8,
          listStyle: '0 - fmListStylePlain',
          listWidth: '0 pt',
          locked: false,
          isActive: false,
          matchEntry: '1 - fmMatchEntryComplete',
          matchRequired: false,
          maxLength: 0,
          mouseIcon: '(None)',
          rowSource: '',
          selectionMargin: true,
          showDropButtonWhen: '2 - fmShowDropButtonWhenAlways',
          tabIndex: 4,
          tabStop: true,
          tag: '',
          text: '',
          textColumn: -1,
          topIndex: -1,
          value: '',
          visible: true,
          left: '20px',
          top: '100px',
          width: '100px',
          height: '40px',
          zIndex: '1',
          backColor: 'white',
          borderColor: '#eeeeee',
          border: '1px solid',
          borderStyle: 'solid',
          font: 'Arial, Helvetica, sans-serif',
          foreColor: 'black',
          textAlign: 'left',
          cursor: 'default',
          specialEffect: 'none',
          wordWrap: 'break-word',
          overflow: 'hidden',
          whiteSpace: 'normal',
          backStyle: '1 - fmBackStyleOpaque',
          mousePointer: ''
        },
        controls: [],
        extraDatas: {},
        type: 'ComboBox'
      },
      Frame: {
        properties: {
          name: 'Frame1',
          caption: 'Frame1',
          controlTipText: '',
          cycle: '0 - fmCycleAllForms',
          enabled: true,
          helpContextId: 0,
          keepScrollsBarsVisible: '3 - fmScrollBarsBoth',
          mouseIcon: '(None)',
          picture: '(None)',
          pictureAlignment: '2 - fmPictureAlignmentCenter',
          pictureSizeMode: '0 - fmPictureSizeModeClip',
          pictureTiling: false,
          scrollBars: '0 - fmScrollBarsNone',
          scrollHeight: 0,
          scrollLeft: 0,
          scrollTop: 0,
          scrollWidth: 0,
          tabIndex: 11,
          tabStop: true,
          tag: '',
          value: '',
          visible: true,
          isActive: false,
          left: '20px',
          top: '100px',
          width: '100px',
          height: '40px',
          zIndex: '1',
          backColor: 'white',
          borderColor: '#eeeeee',
          border: '1px solid',
          borderStyle: 'solid',
          font: 'Arial, Helvetica, sans-serif',
          foreColor: 'black',
          textAlign: 'left',
          cursor: 'default',
          specialEffect: 'none',
          wordWrap: 'break-word',
          overflow: 'hidden',
          whiteSpace: 'normal',
          position: '',
          mousePointer: ''

        },
        controls: [],
        extraDatas: {},
        type: 'Frame'
      },
      Image: {
        properties: {
          AutoSize: false,
          BackColor: '#eeeeee',
          BackStyle: 1,
          BorderColor: '#ffffff',
          BorderStyle: 1,
          ControlTipText: 'helptext',
          Enabled: true,
          Height: 72,
          Left: 10,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'Image1',
          ID: 'ID_Image1',
          Picture: '',
          PictureAlignment: 2,
          PictureSizeMode: 0,
          PictureTiling: false,
          SpecialEffect: 0,
          Tag: '',
          Top: 10,
          Visible: true,
          Width: 72,
          GroupID: ''
        },
        controls: [],
        extraDatas: {},
        type: 'FDImage'
      },
      ListBox: {
        properties: {
          Name: 'ListBox1',
          BackColor: 'white',
          BorderColor: '#eeeeee',
          BorderStyle: 'solid',
          BoundColumn: 1,
          ColumnCount: 1,
          ColumnHeads: false,
          ColumnWidths: '',
          ControlSource: '',
          ControlTipText: '',
          Enabled: true,
          Font: 'Arial, Helvetica, sans-serif',
          ForeColor: 'black',
          Height: '157px',
          HelpContextId: 0,
          ImeMode: '0 - fmIMEModeNOControl',
          IntegralHeight: true,
          Left: '10px',
          ListStyle: '0 - fmListStylePlain',
          Locked: false,
          MatchEntry: '0 - fmMatchEntryFirstLetter',
          MouseIcon: '(None)',
          MultiSelect: '0 - fm-MousePointerDefault',
          MousePointer: '',
          RowSource: '',
          SpecialEffect: 'none',
          TabIndex: 6,
          TabStop: true,
          Tag: '',
          Text: '',
          TextAlign: 'left',
          TextColumn: -1,
          Top: '10px',
          TopIndex: -1,
          Value: '',
          Visible: true,
          Width: '162px'
        },
        controls: [],
        extraDatas: {},
        type: 'ListBox'
      },
      MultiPage: {
        properties: {
          name: 'MultiPage1',
          controlTipText: '',
          enabled: true,
          helpContextId: 0,
          multiRow: false,
          tabFixedHeight: 0,
          tabFixedWidth: 0,
          tabIndex: 13,
          tabOrientation: '0 - fmTabOrientationTop',
          tabStop: true,
          tag: '',
          value: '',
          visible: true,
          isActive: false,
          left: '20px',
          top: '100px',
          width: '100px',
          height: '40px',
          zIndex: '1',
          backColor: 'white',
          font: 'Arial, Helvetica, sans-serif',
          foreColor: 'black',
          style: '',
          position: ''
        },
        controls: [],
        extraDatas: {},
        type: 'MultiPage'
      },
      OptionButton: {
        properties: {
          name: 'OptionButton1',
          caption: 'OptionButton1',
          accelerator: '',
          alignment: '1 - fmAlignmentRight',
          autoSize: false,
          controlSource: '',
          controlTipText: '',
          enabled: true,
          groupName: '',
          helpContextId: 0,
          locked: false,
          mouseIcon: '(None)',
          picture: '(None)',
          picturePosition: '7 - fmPicturePositionAboveCenter',
          tabIndex: 10,
          tabStop: true,
          tripleState: false,
          isActive: false,
          tag: '',
          value: '',
          visible: true,
          left: '20px',
          top: '100px',
          width: '100px',
          height: '40px',
          zIndex: '1',
          backColor: 'white',
          borderColor: '#eeeeee',
          border: '1px solid',
          backStyle: 'solid',
          font: 'Arial, Helvetica, sans-serif',
          foreColor: 'black',
          textAlign: 'left',
          mousePointer: 'default',
          specialEffect: 'none',
          wordWrap: 'break-word',
          overflow: 'hidden',
          whiteSpace: 'normal',
          position: ''

        },
        controls: [],
        extraDatas: {},
        type: 'OptionButton'
      },
      ScrollBar: {
        properties: {
          BackColor: 'lightgray',
          ControlSource: '',
          ControlTipText: 'ScrollBar1',
          Delay: 50,
          Enabled: true,
          ForeColor: '#000000',
          Height: 30,
          HelpContextID: '0',
          LargeChange: 0,
          Left: 50,
          Max: 100,
          Min: 0,
          MouseIcon: '',
          MousePointer: 7,
          Orientation: -1,
          ProportionalThumb: 0,
          SmallChange: 1,
          Name: 'ScrollBar1',
          ID: 1,
          TabIndex: 0,
          TabStop: true,
          Tag: '',
          Top: 200,
          Value: 0,
          Visible: true,
          Width: 100
        },
        controls: [],
        extraDatas: {
          Active: false
        },
        type: 'ScrollBar'
      },
      SpinButton: {
        properties: {
          BackColor: 'lightgray',
          ControlSource: '',
          ControlTipText: 'SpinButton1',
          Delay: 50,
          Enabled: true,
          ForeColor: '#000000',
          Height: 30,
          HelpContextID: '0',
          Left: 50,
          Max: 100,
          Min: 0,
          MouseIcon: '',
          MousePointer: 7,
          Orientation: -1,
          Name: 'SpinButton1',
          SmallChange: 1,
          ID: 1,
          TabIndex: 0,
          TabStop: true,
          Tag: '',
          Top: 200,
          Value: 0,
          Visible: true,
          Width: 100
        },
        extraDatas: {
          Active: false
        },
        controls: [],
        type: 'SpinButton'
      },
      TabStrip: {
        properties: {
          name: 'TabStrip1',
          controlTipText: '',
          enabled: true,
          helpContextId: 0,
          mouseIcon: '(None)',
          multiRow: false,
          picture: '(None)',
          tabFixedHeight: 0,
          tabFixedWidth: 0,
          tabIndex: 13,
          tabOrientation: '0 - fmTabOrientationTop',
          tabStop: true,
          tag: '',
          value: '',
          visible: true,
          left: '20px',
          top: '100px',
          width: '100px',
          height: '40px',
          zIndex: '1',
          backColor: 'white',
          font: 'Arial, Helvetica, sans-serif',
          foreColor: 'black',
          mousePointer: 'default',
          position: '',
          style: '',
          isActive: false
        },
        controls: [],
        extraDatas: {},
        type: 'TabStrip'
      },
      ToggleButton: {
        properties: {
          Accelerator: '',
          AutoSize: false,
          BackColor: 'red',
          BackStyle: 1,
          Caption: 'ToggleButton1',
          ControlSource: '',
          ControlTipText: 'helptext',
          Enabled: true,
          Font: {
            FontName: 'Arial',
            FontSize: 15,
            FontBold: false,
            FontItalic: false,
            FontUnderline: false,
            FontStrikethrough: true,
            FontStyle: 'Arial Narrow Italic'
          },
          ForeColor: '#000000',
          Height: 60,
          HelpContextID: 0,
          Left: 50,
          Locked: false,
          MouseIcon: '',
          MousePointer: 7,
          Name: 'ToggleButton1',
          ID: 'ID_ToggleButton1',
          Picture: '',
          PicturePosition: 7,
          TabIndex: 0,
          TabStop: true,
          Tag: '',
          TextAlign: 1,
          Top: 200,
          TripleState: false,
          Value: false,
          Visible: true,
          Width: 55,
          WordWrap: true
        },
        controls: [],
        extraDatas: {
          Active: false
        },
        type: 'ToggleButton'
      },
      TextBox: {
        properties: {
          AutoSize: false,
          AutoTab: false,
          AutoWordSelect: true,
          BackColor: '#ffffff',
          BackStyle: 1,
          BorderColor: '#ffffff',
          BorderStyle: 1,
          ControlSource: 'a1',
          ControlTipText: 'helptext',
          CursorStartPosition: '',
          CursorEndPosition: '',
          DragBehavior: 0,
          Enabled: true,
          EnterFieldBehavior: 0,
          EnterKeyBehavior: false,
          Font: {
            FontName: 'Arial',
            FontSize: 10,
            FontBold: false,
            FontItalic: false,
            FontUnderline: false,
            FontStrikethrough: false,
            FontStyle: 'Arial Narrow Italic'
          },
          ForeColor: '#000000',
          Height: 18,
          HelpContextID: 0,
          HideSelection: true,
          IMEMode: 0,
          IntegralHeight: true,
          Left: 0,
          Locked: false,
          MaxLength: 0,
          MouseIcon: '',
          MousePointer: 0,
          MultiLine: false,
          Name: 'TextBox',
          ID: 'ID_TextBox1',
          PasswordChar: '',
          ScrollBars: 0,
          SelectionMargin: true,
          SpecialEffect: 2,
          TabIndex: 0,
          TabKeyBehavior: false,
          TabStop: true,
          Tag: '',
          Text: 'hello',
          TextAlign: 0,
          Top: 0,
          Value: 'hello',
          Visible: true,
          Width: 72,
          WordWrap: true
        },
        controls: [],
        extraDatas: {
          Active: false,
          ControlSourceValue: 'hi'
        },
        type: 'Textbox'
      }
    }
  }
}
