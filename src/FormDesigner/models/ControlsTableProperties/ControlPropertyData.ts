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
            FontItalic: false,
            FontUnderline: false,
            FontStrikethrough: false,
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
            FontItalic: false,
            FontUnderline: false,
            FontStrikethrough: false,
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
          acceleratorValue: '',
          zIndex: -1
        },
        type: 'Label'
      },
      CommandButton: {
        properties: {
          Accelerator: '',
          AutoSize: false,
          BackColor: '#eeeeee',
          BackStyle: 1,
          Caption: 'CommandButton1',
          Cancel: false,
          ControlTipText: 'CommandButton',
          Default: false,
          Enabled: true,
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
          Height: 22,
          HelpContextID: 0,
          Left: 20,
          Locked: false,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'CommandButton1',
          ID: 'ID_CommandButton1',
          Picture: '',
          PicturePosition: 12,
          TabIndex: 11,
          TabStop: true,
          Tag: '',
          TakeFocusOnClick: true,
          Top: 50,
          Visible: true,
          Width: 120,
          WordWrap: true,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          zIndex: -1
        },
        type: 'CommandButton'
      },
      CheckBox: {
        properties: {
          Accelerator: '',
          Alignment: 1,
          AutoSize: false,
          BackColor: '#D6D5D5',
          BackStyle: 1,
          Caption: 'CheckBox1',
          ControlTipText: 'helptext',
          ControlSource: '',
          Enabled: true,
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
          GroupName: '',
          Height: 18,
          HelpContextID: 0,
          Left: 10,
          Locked: false,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'CheckBox1',
          ID: 'ID_CheckBox1',
          Picture: '',
          PicturePosition: 7,
          SpecialEffect: 0,
          TabIndex: 8,
          TabStop: true,
          Tag: '',
          TextAlign: 1,
          Top: 10,
          TripleState: false,
          Value: 'False',
          Visible: true,
          Width: 72,
          WordWrap: true,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          ControlSourceValue: 'true',
          zIndex: -1
        },
        type: 'CheckBox'
      },
      ComboBox: {
        properties: {
          AutoSize: false,
          AutoTab: false,
          AutoWordSelect: true,
          BackColor: '#ffffff',
          BackStyle: 1,
          BorderColor: '#eeeeee',
          BorderStyle: 1,
          BoundColumn: 3,
          ColumnCount: 1,
          ColumnHeads: false,
          ColumnWidths: '90pt',
          ControlSource: 'd8',
          ControlTipText: 'ComboBox',
          DragBehavior: 0,
          DropButtonStyle: 1,
          Enabled: true,
          EnterFieldBehavior: 0,
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
          Left: 20,
          ListRows: 4,
          ListStyle: 0,
          ListWidth: '0 pt',
          Locked: false,
          MatchEntry: 1,
          MatchRequired: false,
          MaxLength: 0,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'ComboBox',
          ID: 'ID_ComboBox1',
          RowSource: 'a1:c9',
          ShowDropButtonWhen: 2,
          SelectionMargin: true,
          SpecialEffect: 2,
          Style: 0,
          TabIndex: 6,
          TabStop: true,
          Tag: '',
          Text: 's',
          TextAlign: 0,
          TextColumn: 2,
          Top: 20,
          TopIndex: -1,
          Value: '',
          Visible: true,
          Width: 72,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          // it can be different from value
          ControlSourceValue: 'c3',
          ColumnHeadsValues: ['column1', 'column2', 'column3'],
          RowSourceData: [
            ['a', 'k', 'a1'],
            ['b', 'b', 'b2'],
            ['c', 's', 'c3'],
            ['d', 'a', 'd4'],
            ['e', 'd', 'e5'],
            ['f', 'wef', 'f6'],
            ['g', 'awe', 'g7'],
            ['h', 'rty', 'h8'],
            ['i', 'qqq', 'i9']
          ],
          zIndex: -1
        },
        type: 'ComboBox'
      },
      Frame: {
        properties: {
          BackColor: '#ffffff',
          BorderColor: '#ffffff',
          BorderStyle: 1,
          Caption: 'Frame1',
          ControlTipText: 'helptext',
          Cycle: 0,
          Enabled: true,
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
          Height: 144,
          HelpContextID: 0,
          KeepScrollBarsVisible: 0,
          Left: 0,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'Frame1',
          ID: 'ID_Frame1',
          Picture: '',
          PictureAlignment: 2,
          PictureSizeMode: 0,
          PictureTiling: false,
          ScrollBars: 0,
          ScrollHeight: 0,
          ScrollLeft: 0,
          ScrollTop: 0,
          ScrollWidth: 0,
          SpecialEffect: 3,
          TabIndex: 12,
          TabStop: true,
          Tag: '',
          Top: 0,
          Visible: true,
          Width: 400,
          Zoom: 100,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          zIndex: -1
        },
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
          Height: 400,
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
          Width: 400,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          zIndex: -1,
          TabIndex: 0
        },
        type: 'FDImage'
      },
      ListBox: {
        properties: {
          BackColor: '#ffffff',
          BorderColor: '#ffffff',
          BorderStyle: 0,
          BoundColumn: 3,
          ColumnCount: 5,
          ColumnHeads: false,
          // ColumnWidths: '30pt;50pt;100pt',
          ColumnWidths: '70pt',
          ControlSource: 'd7',
          ControlTipText: 'ListBox',
          Enabled: true,
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
          Height: 150,
          HelpContextID: 0,
          IMEMode: 0,
          IntegralHeight: true,
          Left: 20,
          ListStyle: 0,
          Locked: false,
          MatchEntry: 0,
          MouseIcon: '',
          MousePointer: 0,
          MultiSelect: 0,
          Name: 'ListBox1',
          ID: 'ID_ListBox1',
          RowSource: 'a2:c5',
          SpecialEffect: 2,
          TabIndex: 7,
          TabStop: true,
          Tag: '',
          Text: 'b',
          TextAlign: 0,
          TextColumn: 1,
          Top: 20,
          TopIndex: -1,
          Value: 'd4',
          Visible: true,
          Width: 200,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          // it can be different from value
          ControlSourceValue: 'd4',
          zIndex: -1,
          ColumnHeadsValues: ['a', 'f', 'a1'],
          // ListBox.List
          RowSourceData: [
            ['b', 'g', 'b2'],
            ['cat', 'h', 'c3'],
            ['d', 'i', 'd4'],
            ['e', 'j', 'e5']
          ],
          MatchData: ''
        },
        type: 'ListBox'
      },
      MultiPage: {
        properties: {
          ID: 'ID_MultiPage1',
          Name: 'MultiPage1',
          BackColor: '#eeeeee',
          ControlTipText: '',
          Enabled: true,
          Font: {
            FontName: 'Arial',
            FontSize: 15,
            FontBold: false,
            FontItalic: false,
            FontUnderline: false,
            FontStrikethrough: false,
            FontStyle: 'Arial Narrow Italic'
          },
          ForeColor: '#111111',
          Height: 200,
          HelpcontextID: 0,
          Left: 40,
          MultiRow: false,
          Style: 0,
          TabFixedHeight: 0,
          TabFixedWidth: 0,
          TabIndex: 14,
          TabOrientation: 0,
          TabStop: true,
          Tag: '',
          Top: 20,
          Value: 0,
          Visible: true,
          Width: 400,
          GroupID: '',
          Index: 0
        },
        controls: ['ID_Page1_1', 'ID_Page1_2'],
        extraDatas: {
          zIndex: -1
        },
        type: 'MultiPage'
      },
      OptionButton: {
        properties: {
          Accelerator: '',
          Alignment: 1,
          AutoSize: false,
          BackColor: '#D6D5D5',
          BackStyle: 1,
          Caption: 'OptionButton1',
          ControlTipText: 'helptext',
          ControlSource: '',
          Enabled: true,
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
          GroupName: '',
          Height: 25,
          HelpContextID: 0,
          Left: 50,
          Locked: false,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'OptionButton1',
          ID: 'ID_OptionButton1',
          Picture: '',
          PicturePosition: 12,
          SpecialEffect: 0,
          TabIndex: 9,
          TabStop: true,
          Tag: '',
          TextAlign: 1,
          Top: 100,
          TripleState: false,
          Value: 'False',
          Visible: true,
          Width: 100,
          WordWrap: true,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          ControlSourceValue: 'true',
          zIndex: -1
        },
        type: 'OptionButton'
      },
      ScrollBar: {
        properties: {
          BackColor: '#eeeeee',
          ControlSource: '',
          ControlTipText: 'ScrollBar',
          Delay: 50,
          Enabled: true,
          ForeColor: '#000000',
          Height: 180,
          HelpContextID: 0,
          LargeChange: 1,
          Left: 0,
          Max: 100,
          Min: 0,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'ScrollBar1',
          ID: 'ID_ScrollBar1',
          Orientation: 0,
          ProportionalThumb: true,
          SmallChange: 1,
          TabIndex: 15,
          TabStop: true,
          Tag: '',
          Top: 0,
          Value: 0,
          Visible: true,
          Width: 22,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          ControlSourceValue: '0',
          zIndex: -1
        },
        type: 'ScrollBar'
      },
      SpinButton: {
        properties: {
          BackColor: '#eeeeee',
          ControlSource: '',
          ControlTipText: 'SpinButton',
          Delay: 50,
          Enabled: true,
          ForeColor: '#000000',
          Height: 180,
          HelpContextID: 0,
          Left: 0,
          Max: 32767,
          Min: 0,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'SpinButton1',
          ID: 'ID_SpinButton1',
          Orientation: 0,
          SmallChange: 1,
          TabIndex: 16,
          TabStop: true,
          Tag: '',
          Top: 0,
          Value: 0,
          Visible: true,
          Width: 72,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          ControlSourceValue: '1',
          zIndex: -1
        },
        type: 'SpinButton'
      },
      TabStrip: {
        properties: {
          BackColor: '#eeeeee',
          ControlTipText: 'TabStrip',
          Enabled: true,
          Font: {
            FontName: 'Arial',
            FontSize: 15,
            FontBold: false,
            FontItalic: false,
            FontUnderline: false,
            FontStrikethrough: false,
            FontStyle: 'Arial Narrow Italic'
          },
          ForeColor: '#111111',
          Height: 300,
          HelpContextID: 0,
          Left: 50,
          MouseIcon: '',
          MousePointer: 0,
          MultiRow: false,
          Style: 0,
          Name: 'TabStrip1',
          ID: 'ID_TabStrip1',
          TabFixedHeight: 30,
          TabFixedWidth: 30,
          TabIndex: 4,
          TabOrientation: 0,
          TabStop: true,
          Tag: '',
          Top: 20,
          // ListIndex
          Value: 0,
          Visible: true,
          Width: 300,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          Tabs: [
            {
              Name: 'Tab1',
              Caption: 'Tab1',
              ToolTip: 'Select Tab1',
              Accelerator: ''
            },
            {
              Name: 'Tab2',
              Caption: 'Tab2',
              ToolTip: 'Select Tab2',
              Accelerator: ''
            },
            {
              Name: 'Tab3',
              Caption: 'Tab3',
              ToolTip: 'Select Tab3',
              Accelerator: ''
            },
            {
              Name: 'Tab4',
              Caption: 'Tab4',
              ToolTip: 'Select Tab4',
              Accelerator: ''
            },
            {
              Name: 'Tab5',
              Caption: 'Tab5',
              ToolTip: 'Select Tab5',
              Accelerator: ''
            }
          ],
          zIndex: -1
        },
        type: 'TabStrip'
      },
      ToggleButton: {
        properties: {
          Accelerator: '',
          AutoSize: false,
          BackColor: '#eeeeee',
          BackStyle: 1,
          Caption: 'Toggle Button1',
          ControlSource: '',
          ControlTipText: 'ToggleButton',
          Enabled: true,
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
          Height: 60,
          HelpContextID: 0,
          Left: 20,
          Locked: false,
          MouseIcon: '',
          MousePointer: 0,
          Name: 'ToggleButton1',
          ID: 'ID_ToggleButton1',
          Picture: '',
          PicturePosition: 7,
          TabIndex: 10,
          TabStop: true,
          Tag: '',
          TextAlign: 1,
          Top: 10,
          TripleState: false,
          Value: 'True',
          Visible: true,
          Width: 55,
          WordWrap: true,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          ControlSourceValue: 'True',
          zIndex: -1
        },
        type: 'ToggleButton'
      },
      Page: {
        properties: {
          ID: 'Page1',
          Name: 'Page1',
          Accelerator: '',
          Caption: 'Page1',
          ControlTipText: 'Select the Page1',
          Cycle: 0,
          Enabled: true,
          Index: 0,
          KeepScrollBarsVisible: 3,
          Picture: '',
          PictureAlignment: 2,
          PictureSizeMode: 0,
          PictureTiling: false,
          ScrollBars: 0,
          ScrollHeight: 0,
          ScrollLeft: 0,
          ScrollTop: 0,
          ScrollWidth: 0,
          Tag: '',
          TransitionEffect: 0,
          TransitionPeriod: 0,
          Visible: true,
          Zoom: 100
        },
        extraDatas: {
          zIndex: -1
        },
        controls: [],
        type: 'Page'
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
          ControlSource: '',
          ControlTipText: 'helptext',
          CursorStartPosition: 0,
          CursorEndPosition: 0,
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
          Left: 10,
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
          TabIndex: 4,
          TabKeyBehavior: false,
          TabStop: true,
          Tag: '',
          Text: 'hello',
          TextAlign: 0,
          Top: 30,
          Value: 'hello',
          Visible: true,
          Width: 72,
          WordWrap: true,
          GroupID: ''
        },
        controls: [],
        extraDatas: {
          ControlSourceValue: 'hi',
          zIndex: -1
        },
        type: 'TextBox'
      }
    }
  }
}
