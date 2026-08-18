import type { ICategoryRepo } from "./category/ICategoryRepo";
import type { IAlertRepo } from "./alert/IAlertRepo";
import type { ICityUpdateRepo } from "./cityUpdate/ICityUpdateRepo";
import type { ICompanyRepo } from "./company/ICompanyRepo";
import type { IEventRepo } from "./event/IEventRepo";
import type { IHomeRepo } from "./home/IHomeRepo";
import type { IJobRepo } from "./job/IJobRepo";
import type { INewsRepo } from "./news/INewsRepo";
import type { IPromotionRepo } from "./promotion/IPromotionRepo";
import type { IUsefulServiceRepo } from "./usefulService/IUsefulServiceRepo";
import type { IAppVersionRepo } from "./appVersion/IAppVersionRepo";
import type { IClassifiedRepo } from "./classified/IClassifiedRepo";
import type { ILostFoundRepo } from "./lostFound/ILostFoundRepo";

export type Repositories = {
  homeRepo: IHomeRepo;
  companyRepo: ICompanyRepo;
  eventRepo: IEventRepo;
  newsRepo: INewsRepo;
  categoryRepo: ICategoryRepo;
  promotionRepo: IPromotionRepo;
  jobRepo: IJobRepo;
  alertRepo: IAlertRepo;
  cityUpdateRepo: ICityUpdateRepo;
  usefulServiceRepo: IUsefulServiceRepo;
  appVersionRepo: IAppVersionRepo;
  classifiedRepo: IClassifiedRepo;
  lostFoundRepo: ILostFoundRepo;
};
