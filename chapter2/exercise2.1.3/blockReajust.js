const blocReajustement = (hauteurBloc) => {
	if ((hauteurBloc % 2016) === 0)
		return true;
	else return false;
};

console.log(blocReajustement(556416));