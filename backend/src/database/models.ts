import { DataTypes, InferAttributes, InferCreationAttributes, Model, CreationOptional, ForeignKey } from "sequelize";
import { sequelize } from "./sequelize.js";

export type RequestStatus = "PENDING" | "REJECTED" | "COMPLETED";
export type ApproverStatus = "PENDING" | "SIGNED" | "REJECTED";

export class PurchaseRequest extends Model<InferAttributes<PurchaseRequest>, InferCreationAttributes<PurchaseRequest>> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: string;
  declare amount: string;
  declare requesterName: string;
  declare status: CreationOptional<RequestStatus>;
  declare evidencePath: CreationOptional<string | null>;
  declare evidenceKey: CreationOptional<string | null>;
  declare completedAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PurchaseRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },
    requesterName: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("PENDING", "REJECTED", "COMPLETED"),
      allowNull: false,
      defaultValue: "PENDING"
    },
    evidencePath: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    evidenceKey: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: "purchase_requests"
  }
);

export class Approver extends Model<InferAttributes<Approver>, InferCreationAttributes<Approver>> {
  declare id: CreationOptional<string>;
  declare requestId: ForeignKey<PurchaseRequest["id"]>;
  declare name: string;
  declare email: string;
  declare token: string;
  declare status: CreationOptional<ApproverStatus>;
  declare signedAt: CreationOptional<Date | null>;
  declare rejectedAt: CreationOptional<Date | null>;
  declare otpValidatedUntil: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Approver.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    requestId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SIGNED", "REJECTED"),
      allowNull: false,
      defaultValue: "PENDING"
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    otpValidatedUntil: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: "approvers"
  }
);

export class OtpCode extends Model<InferAttributes<OtpCode>, InferCreationAttributes<OtpCode>> {
  declare id: CreationOptional<string>;
  declare approverId: ForeignKey<Approver["id"]>;
  declare codeHash: string;
  declare expiresAt: Date;
  declare usedAt: CreationOptional<Date | null>;
  declare attempts: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

OtpCode.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    approverId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    codeHash: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attempts: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: "otp_codes"
  }
);

PurchaseRequest.hasMany(Approver, { foreignKey: "requestId", as: "approvers", onDelete: "CASCADE" });
Approver.belongsTo(PurchaseRequest, { foreignKey: "requestId", as: "request" });
Approver.hasMany(OtpCode, { foreignKey: "approverId", as: "otpCodes", onDelete: "CASCADE" });
OtpCode.belongsTo(Approver, { foreignKey: "approverId", as: "approver" });

export const models = {
  PurchaseRequest,
  Approver,
  OtpCode
};
