CREATE TABLE stereotype (
	stereotypeId serial primary key,
	stereotypeValue varchar(64) NOT NULL UNIQUE
);
CREATE TABLE snapshot (
	stereotypeId serial references stereotype(stereotypeId),
	countryCode char(2) NOT NULL,
	date date NOT NULL
);
