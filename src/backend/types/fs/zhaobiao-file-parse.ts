export interface Zhaobiao_FileInfo {
  fileVersionInfo: Zhaobiao_FileVersionInfo; //文件版本信息
  projectInfo: Zhaobiao_ProjectInfo; //项目信息
  docFileInfos: Zhaobiao_DocFileInfo[]; //招标文件附件
  docCompositionInfos: Zhaobiao_ToubiaoDocCompositionInfo[]; //投标文件组成
  quotationListInfos: Zhaobiao_QuotationListInfoDeserialized[]; //报价清单
}

export interface Zhaobiao_FileVersionInfo {
  tradeProjectId: string; //交易平台招标项目ID
  tradeSectionId: string; //交易平台标段ID
  fileType?: string; //文件类型  1.招标文件2.采购文件3.补充文件
  version: string; //版本号
}

//招标项目信息
export interface Zhaobiao_ProjectInfo {
  tddProjectId: string; //招标项目ID
  tradeProjectId: string; //招标项目ID-交易平台
  projectName?: string; //招标项目名称
  projectCode?: string; //招标项目编号
  projectType?: string; //项目类型
  executionType?: number; //项目执行类型  1、按项目 2、按标段
  tendererName?: string; //招标人名称
  tendererLegal?: string; //招标人法人
  tendererContactPerson?: string; //招标人联系人
  tendererContactPhone?: string; //招标人手机号
  agencyLegal?: string; //招标代理机构法人
  agencyContactPerson?: string; //招标代理联系人
  agencyContactPhone?: string; //招标代理联系人手机号
  agencyName?: string; //招标代理机构名称
  tenderMethod?: string; //招采方式
  tenderMethodName?: string; //招采方式名称
  orgMethod?: string; //组织形式
  orgMethodName?: string; //组织形式名称
  caEncryptionFlag: number; //投标是否使用CA锁
  sectionInfoList?: Zhaobiao_SectionInfo[];
}

//招标标段信息
export interface Zhaobiao_SectionInfo {
  tddSectionId: string; //标段ID
  tradeSectionId: string; //标段ID-交易平台
  sectionCode?: string; //标段编号
  sectionName?: string; //标段名称
  templateName?: string; //模版名称
  bidEvaluationMethodType?: number; //评标办法类型，1-开评分离，2-开评一体，3-资格预审
}

//招标文件附件
export interface Zhaobiao_DocFileInfo {
  fileId: string; //存储文件id
  fileType: string; //文件类型，1-招标文件、2-其他文件、3-工程量清单、4-电子招标文件
  fileName?: string; //文件名称
}

//投标文件组成
export interface Zhaobiao_ToubiaoDocCompositionInfo {
  id: string; //ID
  docType: string; //投标文件类型 1.资信标 2.商务标 3.技术标 99.其他
  docName?: string; //文件名称
  docFormat?: string; //文件格式
  signStatus: boolean; //是否签章
  selectStatus: boolean; //是否勾选
  sort?: number; //排序
  fileId?: string; //附件模版ID
  darkFlag: boolean; //是否设为暗标
  parentId?: string; //父级ID
}

//报价清单
export interface Zhaobiao_QuotationListInfo {
  tddSectionId: string; //招标标段id
  tradeSectionId: string; //交易标段id
  offerList: string; //报价清单
}

export interface Zhaobiao_QuotationListInfoDeserialized
  extends Zhaobiao_QuotationListInfo {
  offerTable: InventoryTableWithDetail; //报价清单表格
}

//清单表格
export interface InventoryTable {
  tableHead: InventoryTableHeaderColumn[]; //表头列表
  tableData: Map<string, object>[]; //表体数据
}

export interface InventoryTableExt extends InventoryTable {
  tip: string; //表格标题
  showEdit: boolean;
}

//清单表格--with表头详情
export interface InventoryTableWithDetail {
  tableHead: InventoryTableHeaderColumnDetail[]; //表头详情列表
  tableData: Map<string, object>[]; //表体数据
}

//清单表头列
export interface InventoryTableHeaderColumn {
  label?: string; //标签
  prop: string; //属性
  uniqueKey?: string; //唯一标识
  indexKey?: number; //排序
}

//清单表头列--详情
export interface InventoryTableHeaderColumnDetail
  extends InventoryTableHeaderColumn {
  valueType: number; //值类型
  valueSource: number; //值来源
  digits?: string; //小数保留位数
  startNumber?: string; //数值输入区间-开始
  endNumber?: string; //数值输入区间-结束
  calculateList?: InventoryTableHeaderCalcFormulaSegment[]; //计算公式
  isBidAnnouncement?: number;
  required?: number;
}

//清单表头列--计算公式片段
export interface InventoryTableHeaderCalcFormulaSegment {
  value: string; //片段的值（对应表头的prop, +, -, *, /, (, ), %, sum, average）
  label?: string; //片段标签（对应表头的label, 运算符或函数的文本显示）
  type: string; //对应表头的排序, +, -, *, /, (, ), %, sum, average
  differ?: string; //片段分类（param参数, symbol符号, function公式）
}
