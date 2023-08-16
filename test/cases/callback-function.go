sort.SliceStable(values, func(i, j int) bool {
	return values[i].After(values[j])
})